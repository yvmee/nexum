import React, { useEffect } from 'react';
import * as motion from "motion/react-client"
import clockImage from '../../../assets/props/Clock.png';

interface ClockSceneProps {
  onComplete: () => void;
}

const CLOCK_SIZE = 300;
const HAND_WIDTH = 6;
const HAND_LENGTH = CLOCK_SIZE * 0.33;
const ANIMATION_DURATION = 3; // seconds for one full rotation

export const ClockScene: React.FC<ClockSceneProps> = ({ onComplete }) => {

  useEffect(() => {
    const timer = setTimeout(onComplete, ANIMATION_DURATION * 1000 + 300);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="absolute inset-0 flex items-center justify-center">

        {/* Dark blurred backdrop */}
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.55)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', }} />

        {/* Container sized to the clock image */}
        <div style={{ position: 'relative', width: CLOCK_SIZE, height: CLOCK_SIZE }}>

        {/* Clock face */}
        <img
          src={clockImage}
          alt="Clock"
          style={{ width: CLOCK_SIZE, height: CLOCK_SIZE, objectFit: 'contain' }}
        />

        {/* Clock hand */}
        <motion.div
          style={{
            position: 'absolute',
            left: `calc(50% - ${HAND_WIDTH / 2}px)`,
            bottom: '50%',
            width: HAND_WIDTH,
            height: HAND_LENGTH,
            backgroundColor: '#111',
            borderRadius: '3px 3px 0 0',
            transformOrigin: 'bottom center',
          }}
          // animation to rotate 
          initial={{ rotate: -10 }}  
          animate={{ rotate: 360 }}  
          transition={{ duration: ANIMATION_DURATION, ease: 'linear' }}
        />

      </div>
    </div>
  );
};

