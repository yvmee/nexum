import React, { useEffect, useState } from 'react';
import * as motion from 'motion/react-client';
import { MotionPipImage } from '../MotionPipImage';
import { useSoundStore } from '../../store/useSoundStore';
import { EnergyParticle } from './EnergyGainScene';

interface PipLeaveSceneProps {
  onComplete: () => void;
}

const createDepartureParticles = (): EnergyParticle[] =>
  Array.from({ length: 30 }, (_, i) => ({
    id: i,
    angle: Math.random() * Math.PI * 2,
    distance: Math.random() * 250 + 100,
    size: Math.random() * 10 + 5,
    delay: Math.random() * 0.8,
    duration: Math.random() * 1.2 + 2,
  }));

export const PipLeaveScene: React.FC<PipLeaveSceneProps> = ({ onComplete }) => {
  const playSfx = useSoundStore((s) => s.playSfx);

  useEffect(() => {
    playSfx('glow');
    const timer = setTimeout(onComplete, 4200);
    return () => clearTimeout(timer);
  }, [onComplete, playSfx]);

  const [particles] = useState<EnergyParticle[]>(createDepartureParticles);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
      
      {/* Atmospheric Glow */}
      <motion.div
        className="absolute rounded-full bg-gradient-to-t from-yellow-100 to-transparent mix-blend-screen blur-[90px]"
        initial={{ width: '0px', height: '0px', opacity: 0 }}
        animate={{
          width: ['0px', '300px', '600px', '800px'],
          height: ['0px', '300px', '600px', '800px'],
          opacity: [0, 0.4, 0.5, 0],
        }}
        transition={{
          duration: 4,
          ease: 'easeInOut',
          times: [0, 0.25, 0.7, 1],
        }}
      />

      {/* Glowing particles radiating outward */}
      {particles.map((p) => {
        // Calculate the final X and Y destinations
        const destX = Math.cos(p.angle) * p.distance;
        const destY = Math.sin(p.angle) * p.distance - 200; // Bias upward

        return (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white blur-[1px]"
            style={{
              width: p.size,
              height: p.size,
              boxShadow: '0 0 20px 3px rgba(255, 250, 180, 0.85)',
            }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{
              x: destX,
              y: destY,
              opacity: [0, 0.9, 0.4, 0],
              scale: [0, 1, 0.9, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: 'easeOut',
              times: [0, 0.15, 0.7, 1],
            }}
          />
        );
      })}

      {/* Pip ascending in waves */}
      <motion.div
        className="absolute"
        initial={{ y: 0, opacity: 1 }}
        animate={{
          y: -1200, // Up and out of screen
          opacity: [1, 1, 0.6, 0],
        }}
        transition={{
          duration: 3.8,
          ease: 'easeIn',
          times: [0, 0.65, 0.85, 1],
        }}
      >
        <motion.div
          animate={{
            // Wave motion while ascending
            x: [0, -20, 15, -10, 0],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
        >
          <MotionPipImage
            className="w-(--pip-cutscene-size) h-auto drop-shadow-[0_0_32px_rgba(255,248,212,0.9)]"
            animate={{
              filter: [
                'drop-shadow(0 0 32px rgba(255,248,212,0.9))',
                'drop-shadow(0 0 48px rgba(255,250,180,1))',
                'drop-shadow(0 0 32px rgba(255,248,212,0.9))',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Fade overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.1, 0.3, 0.5] }}
        transition={{ duration: 3.8, ease: 'easeIn', times: [0, 0.5, 0.8, 1] }}
      />
    </div>
  );
};
