import React, { useState, useEffect, useMemo } from 'react';
import { ReflectionData } from '../../db/database';

interface ThoughtBubblesProps {
  reflections: ReflectionData[];
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
 * ThoughtBubbles - Displays other users' reflection texts in floating thought bubbles
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
      .filter(r => r.text && r.text.trim().length > 0)
      .sort(() => Math.random() - 0.5);
    
    return shuffled.slice(0, maxBubbles);
  }, [reflections, maxBubbles]);

  // Generate random positions for bubbles
  const bubblePositions = useMemo((): BubblePosition[] => {
    return selectedReflections.map((_, index) => ({
      // Spread bubbles across the screen, avoiding center (where dialogue box is)
      x: 10 + (index % 2 === 0 ? Math.random() * 30 : 60 + Math.random() * 30),
      y: 35 + Math.random() * 50,
      scale: 0.85 + Math.random() * 0.3,
      delay: index * 0.4 + Math.random() * 0.3,
    }));
  }, [selectedReflections]);

  // Animate bubbles appearing one by one
  useEffect(() => {
    if (!isVisible || selectedReflections.length === 0) {
      setVisibleBubbles([]);
      return;
    }

    // Show bubbles one at a time with staggered delay
    let currentIndex = 0;
    
    const showNextBubble = () => {
      if (currentIndex < selectedReflections.length) {
        setVisibleBubbles(prev => [...prev, currentIndex]);
        currentIndex++;
      }
    };

    // Show first bubble immediately
    showNextBubble();

    // Show remaining bubbles with staggered delay
    const interval = setInterval(() => {
      if (currentIndex < selectedReflections.length) {
        showNextBubble();
      } else {
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [isVisible, selectedReflections.length]);

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
                "{truncateText(reflection.text)}"
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
