import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ReflectionAnswerData, ReflectionData } from '../../db/database';

interface ThoughtBubblesProps {
  reflections: ReflectionAnswerData[];
  isVisible: boolean;
  maxBubbles?: number;
}

interface BubblePosition {
  x: number;
  y: number;
  scale: number;
  delay: number;
}

/**
 * Displays other users' reflection texts in floating thought bubbles
 */
export const ThoughtBubbles: React.FC<ThoughtBubblesProps> = ({
  reflections,
  isVisible,
  maxBubbles = 5,
}) => {
  const [visibleBubbles, setVisibleBubbles] = useState<number[]>([]);

  // Randomly select reflections to display
  const selectedReflections = useMemo(() => {
    if (reflections.length === 0) return [];
    
    // Shuffle and pick up to maxBubbles reflections
    const shuffled = [...reflections]
      .filter(r => r.answer && r.answer.trim().length > 0)
      .sort(() => Math.random() - 0.5);
    
    return shuffled.slice(0, maxBubbles);
  }, [reflections, maxBubbles]);

  // Generate non-overlapping random positions for bubbles
  const bubblePositions = useMemo((): BubblePosition[] => {
    // Estimated bubble dimensions in viewport-percentage units.
    const BUBBLE_W = 22; // % of viewport width (with a small margin)
    const BUBBLE_H = 14; // % of viewport height (with a small margin)

    const placed: BubblePosition[] = [];

    const overlaps = (candidate: { x: number; y: number }, existing: BubblePosition[]) =>
      existing.some(
        (p) => Math.abs(candidate.x - p.x) < BUBBLE_W && Math.abs(candidate.y - p.y) < BUBBLE_H
      );

    const generateCandidate = (index: number) => ({
      // Spread across left / right halves avoiding the centre
      x: 10 + (index % 2 === 0 ? Math.random() * 30 : 60 + Math.random() * 30),
      y: 35 + Math.random() * 50,
    });

    // Try multiple candidates for each bubble to find a non-overlapping position
    for (let i = 0; i < selectedReflections.length; i++) {
      const MAX_ATTEMPTS = 60;
      let bestCandidate = generateCandidate(i);
      let bestMinDist = -Infinity;

      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        const candidate = generateCandidate(i);

        if (!overlaps(candidate, placed)) {
          bestCandidate = candidate;
          bestMinDist = Infinity; // no overlap -> perfect
          break;
        }

        // Track the candidate that is furthest from all others (fallback)
        const minDist = Math.min(
          ...placed.map(
            (p) =>
              Math.hypot((candidate.x - p.x) / BUBBLE_W, (candidate.y - p.y) / BUBBLE_H)
          )
        );
        if (minDist > bestMinDist) {
          bestMinDist = minDist;
          bestCandidate = candidate;
        }
      }

      placed.push({
        x: bestCandidate.x,
        y: bestCandidate.y,
        scale: 0.85 + Math.random() * 0.3,
        delay: i * 0.4 + Math.random() * 0.3,
      });
    }

    return placed;
  }, [selectedReflections]);

  const currentIndexRef = useRef(0);

  // Animate bubbles appearing one by one
  useEffect(() => {
    if (!isVisible || selectedReflections.length === 0) {
      console.debug('Setting visible bubbles to empty');
      setVisibleBubbles([]);
      currentIndexRef.current = 0;
      return;
    }

    setVisibleBubbles([]);
    currentIndexRef.current = 0;
    
    const showNextBubble = () => {
      if (currentIndexRef.current < selectedReflections.length) {
        const indexToAdd = currentIndexRef.current;
        currentIndexRef.current++;
        setVisibleBubbles(prev => {
          const next = [...prev, indexToAdd];
          console.debug('Added bubble. Visible bubbles now:', next);
          return next;
        });
      }
    };

    showNextBubble(); // Show first bubble immediately

    // Show remaining bubbles with staggered delay
    const interval = setInterval(() => {
      if (currentIndexRef.current < selectedReflections.length) {
        showNextBubble();
      } else {
        clearInterval(interval);
      }
    }, 800);

    return () => {
      clearInterval(interval);
      currentIndexRef.current = 0;
    };
  }, [isVisible, selectedReflections]);

  if (!isVisible || selectedReflections.length === 0) {
    return null;
  }

  // Truncate text for display
  const truncateText = (text: string | null, maxLength: number = 150): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  return (
    <div className="fixed inset-0 z-5 pointer-events-none overflow-hidden">
      {selectedReflections.map((reflection, index) => {
        const isShowing = visibleBubbles.includes(index);
        const position = bubblePositions[index];
        
        return (
          <div
            key={reflection.id || index}
            className={`absolute thought-bubble pointer-events-auto cursor-default transition-all duration-700 ease-out ${
              isShowing ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: `scale(${position.scale})`,
              transitionDelay: `${position.delay}s`,
            }}
          >
            <div className="relative max-w-[var(--bubble-max-w)] bg-white/90 dark:bg-card/90 border border-border/50 rounded-2xl p-[var(--bubble-padding)] shadow-lg backdrop-blur-sm">
              {/* Thought bubble tail */}
              <div className="absolute -bottom-3 left-6 w-4 h-4 bg-white/90 dark:bg-card/90 border-l border-b border-border/50 transform rotate-[-45deg]"></div>
              <div className="absolute -bottom-6 left-4 w-2 h-2 bg-white/90 dark:bg-card/90 border border-border/50 rounded-full"></div>
              <div className="absolute -bottom-8 left-2 w-1.5 h-1.5 bg-white/90 dark:bg-card/90 border border-border/50 rounded-full"></div>
              
              {/* Reflection text */}
              <p className="text-[var(--bubble-text)] text-foreground/80 italic leading-relaxed">
                "{truncateText(reflection.answer)}"
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
