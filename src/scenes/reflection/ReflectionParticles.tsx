import React from 'react';
import * as motion from "motion/react-client";
import { useGameStore } from '../../store/useGameStore';

/**
 * Glowing particles at the screen sides, one per point earned reflection
 */
export const ReflectionParticles: React.FC = () => {
  const particles = useGameStore((state) => state.reflectionParticles);

  return (
    <div className="absolute inset-0 z-6 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        // Outer element for position
        // Inner element for idle float
        <motion.div
          key={p.id}
          className="absolute"
          style={{ left: `${p.xPct}%`, top: `${p.yPct}%`, x: '-50%', y: '-50%' }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: [0, 1.6, 1] }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <motion.div
            className="rounded-full bg-white blur-[1px]"
            style={{
              width: p.size,
              height: p.size,
              boxShadow: '0 0 15px 2px rgba(254, 249, 195, 0.9)',
            }}
            animate={{ y: [0, -10, 0], opacity: [0.7, 1, 0.7] }}
            transition={{
              duration: 2.5,
              delay: p.floatDelay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};
