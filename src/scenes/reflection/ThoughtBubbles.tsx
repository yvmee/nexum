import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as motion from "motion/react-client";
import { ReflectionAnswerData } from '../../db/database';

interface ThoughtBubblesProps {
  reflections: ReflectionAnswerData[];
  isVisible: boolean;
  maxBubbles?: number;
  /** True once the player's input is submitted: plays the outro (a brief empty bubble, then all bubbles vanish) */
  isOutro?: boolean;
  onOutroComplete?: () => void;
}

type OutroPhase = 'idle' | 'forming' | 'holding' | 'vanishing';

// Outro timing in ms
const FORM_MS = 900;
const HOLD_MS = 700;
const VANISH_MS = 1300;
const VANISH_STAGGER_S = 0.08;

// Bubble pop position (viewport %) and orb start height, just below the dialogue box
const PLAYER_BUBBLE_TOP = 40;
const ORB_START_TOP = 22;
const ORB_SIZES = [8, 12, 16];
const GLOW = '0 0 22px 4px rgba(254, 249, 195, 0.55)';

// Float duration/delay variations per bubble index
const floatStyle = (index: number): React.CSSProperties => {
  const n = index + 1;
  if (n % 5 === 0) return { animationDuration: '4.2s', animationDelay: '0.7s' };
  if (n % 4 === 0) return { animationDuration: '5.5s', animationDelay: '0.3s' };
  if (n % 3 === 0) return { animationDuration: '4.5s', animationDelay: '1s' };
  if (n % 2 === 0) return { animationDuration: '5s', animationDelay: '0.5s' };
  return {};
};

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
  isOutro = false,
  onOutroComplete,
}) => {
  const [visibleBubbles, setVisibleBubbles] = useState<number[]>([]);
  const [phase, setPhase] = useState<OutroPhase>('idle');
  const onOutroCompleteRef = useRef(onOutroComplete);
  onOutroCompleteRef.current = onOutroComplete;

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
    // Estimated bubble dimensions in viewport-percentage units
    const BUBBLE_W = 22;
    const BUBBLE_H = 14;

    const placed: BubblePosition[] = [];

    // Check if bubble overlaps with existing ones
    const overlaps = (candidate: { x: number; y: number }, existing: BubblePosition[]) =>
      existing.some(
        (p) => Math.abs(candidate.x - p.x) < BUBBLE_W && Math.abs(candidate.y - p.y) < BUBBLE_H
      );

    const generateCandidate = (index: number) => ({
      // Spread across left / right halves avoiding the centre
      x: 5 + (index % 2 === 0 ? Math.random() * 30 : 50 + Math.random() * 30),
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
          bestMinDist = Infinity; // no overlap is best
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

  // Outro: orbs form an empty bubble, it holds briefly, then all vanish
  useEffect(() => {
    if (!isOutro) return;

    const vanishMs = VANISH_MS + selectedReflections.length * VANISH_STAGGER_S * 1000;
    setPhase('forming');
    const timers = [
      setTimeout(() => setPhase('holding'), FORM_MS),
      setTimeout(() => setPhase('vanishing'), FORM_MS + HOLD_MS),
      setTimeout(() => onOutroCompleteRef.current?.(), FORM_MS + HOLD_MS + vanishMs),
    ];
    return () => timers.forEach(clearTimeout);
  }, [isOutro]);

  // Reset once the bubbles are hidden again 
  useEffect(() => {
    if (!isVisible) setPhase('idle');
  }, [isVisible]);

  if (!isVisible || (selectedReflections.length === 0 && !isOutro)) {
    return null;
  }

  // Truncate text for display
  const truncateText = (text: string | null, maxLength: number = 150): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  const isVanishing = phase === 'vanishing';
  const vanishTarget = { opacity: 0, y: -40, scale: 1.1, filter: 'blur(6px)' };
  const restTarget = { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' };

  return (
    <div className="fixed inset-0 z-5 pointer-events-none overflow-hidden">
      {selectedReflections.map((reflection, index) => {
        const isShowing = visibleBubbles.includes(index);
        const position = bubblePositions[index];

        return (
          // Wrapper handles the vanish, so it doesn't clash with the CSS float animation on the bubble
          <motion.div
            key={reflection.id || index}
            className="absolute inset-0 pointer-events-none"
            animate={isVanishing ? vanishTarget : restTarget}
            transition={{ duration: 0.7, ease: 'easeIn', delay: isVanishing ? index * VANISH_STAGGER_S : 0 }}
          >
            <div
              className={`absolute thought-bubble pointer-events-auto cursor-default transition-all duration-700 ease-out ${
                isShowing ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
              }`}
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: `scale(${position.scale})`,
                transitionDelay: `${position.delay}s`,
                ...floatStyle(index),
              }}
            >
              <div className="relative max-w-(--bubble-max-w) bg-white/90 dark:bg-card/90 border border-border/50 rounded-2xl p-(--bubble-padding) shadow-lg backdrop-blur-sm">
                {/* Thought bubble tail */}
                <div className="absolute -bottom-3 left-6 w-4 h-4 bg-white/90 dark:bg-card/90 border-l border-b border-border/50 transform rotate-45"></div>
                <div className="absolute -bottom-6 left-4 w-2 h-2 bg-white/90 dark:bg-card/90 border border-border/50 rounded-full"></div>
                <div className="absolute -bottom-8 left-2 w-1.5 h-1.5 bg-white/90 dark:bg-card/90 border border-border/50 rounded-full"></div>

                {/* Reflection text */}
                <p className="text-(--bubble-text) italic leading-relaxed">
                  "{truncateText(reflection.answer)}"
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Outro: glowing orbs drift down from the dialogue box and form an empty bubble */}
      {phase === 'forming' &&
        ORB_SIZES.map((size, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full bg-white blur-[1px]"
            style={{
              left: '50%',
              top: `${ORB_START_TOP}%`,
              width: size,
              height: size,
              marginLeft: -size / 2,
              boxShadow: '0 0 15px 2px rgba(254, 249, 195, 0.9)',
            }}
            initial={{ opacity: 0, scale: 0, x: (i - 1) * 24 }}
            animate={{
              opacity: [0, 1, 1],
              scale: [0, 1, 1.4],
              x: 0,
              top: `${PLAYER_BUBBLE_TOP + 6}%`,
            }}
            transition={{ duration: 0.75, delay: i * 0.1, ease: 'easeIn' }}
          />
        ))}

      {/* Outro: the new bubble, empty incase players input bs */}
      {(phase === 'holding' || phase === 'vanishing') && isOutro && (
        <motion.div
          className="absolute"
          style={{ left: '50%', top: `${PLAYER_BUBBLE_TOP}%`, x: '-50%' }}
          initial={{ opacity: 0, scale: 0, filter: 'blur(0px)' }}
          animate={isVanishing ? vanishTarget : restTarget}
          transition={
            isVanishing
              ? { duration: 0.7, ease: 'easeIn', delay: selectedReflections.length * VANISH_STAGGER_S }
              : { type: 'spring', stiffness: 260, damping: 16 }
          }
        >
          <div className="thought-bubble">
            <div
              className="relative w-[clamp(70px,9vw,130px)] h-[clamp(45px,6vw,80px)] bg-white/90 dark:bg-card/90 border border-border/50 rounded-2xl shadow-lg backdrop-blur-sm"
              style={{ boxShadow: GLOW }}
            >
              {/* Thought bubble tail */}
              <div className="absolute -bottom-3 left-6 w-4 h-4 bg-white/90 dark:bg-card/90 border-l border-b border-border/50 transform rotate-45"></div>
              <div className="absolute -bottom-6 left-4 w-2 h-2 bg-white/90 dark:bg-card/90 border border-border/50 rounded-full"></div>
              <div className="absolute -bottom-8 left-2 w-1.5 h-1.5 bg-white/90 dark:bg-card/90 border border-border/50 rounded-full"></div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
