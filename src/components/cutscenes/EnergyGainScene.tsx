import React, { useEffect, useState } from 'react';
import * as motion from "motion/react-client";
import { MotionPipImage } from '../MotionPipImage';
import { useSoundStore } from '../../store/useSoundStore';
import { useGameStore, ReflectionParticle } from '../../store/useGameStore';

interface EnergyGainSceneProps {
  onComplete: () => void;
}

export interface EnergyParticle {
  id: number;
  angle: number;
  distance: number;
  size: number;
  delay: number;
  duration: number;
}

// Kept low so the particles the player earned during reflection dominate the visual
const createEnergyParticles = (): EnergyParticle[] =>
  Array.from({ length: 8 }, (_, i) => ({
    id: i,
    angle: Math.random() * Math.PI * 2,
    distance: Math.random() * 300 + 80,
    size: Math.random() * 8 + 4,
    delay: Math.random() * 1.5,
    duration: Math.random() * 1.0 + 1.2,
  }));

export const EnergyGainScene: React.FC<EnergyGainSceneProps> = ({ onComplete }) => {
  const playSfx = useSoundStore((s) => s.playSfx);

  useEffect(() => {
    playSfx('energy');
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const [particles] = useState<EnergyParticle[]>(createEnergyParticles);

  // Take over the particles earned during reflection so they flow into Pip
  const [earnedParticles] = useState<ReflectionParticle[]>(
    () => useGameStore.getState().reflectionParticles
  );
  useEffect(() => {
    useGameStore.getState().clearReflectionParticles();
  }, []);

  // Larger bloom for more earned points
  const bloomSize = 350 + Math.min(earnedParticles.length * 8, 150);

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">

      {/* Central glow bloom that builds as particles are absorbed by Pip */}
      <motion.div
        className="absolute rounded-full bg-yellow-100 mix-blend-screen blur-[70px]"
        style={{ zIndex: 1 }}
        initial={{ width: '0px', height: '0px', opacity: 0 }}
        animate={{
          width: ['0px', '80px', `${bloomSize}px`],
          height: ['0px', '80px', `${bloomSize}px`],
          opacity: [0, 0.25, 0.65],
        }}
        transition={{
          duration: 3.8,
          ease: 'easeIn',
          times: [0, 0.25, 1],
        }}
      />

      {/* Inward-streaming particles pulled toward Pip */}
      {particles.map((p) => {
        // Starting X and Y positions far from center
        const startX = Math.cos(p.angle) * p.distance;
        const startY = Math.sin(p.angle) * p.distance;

        return (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white blur-[1px]"
            style={{
              width: p.size,
              height: p.size,
              boxShadow: '0 0 15px 2px rgba(254, 249, 195, 0.9)',
              zIndex: 5,
            }}
            initial={{ x: startX, y: startY, opacity: 0, scale: 0 }}
            animate={{
              // Accelerate inward toward Pip at (0, 0)
              x: 0,
              y: 0,
              // Shimmer while travelling, then dissolve on absorption
              opacity: [0, 1, 0.8, 0.5, 0],
              scale:   [0, 1, 0.9, 0.6, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              // easeIn makes particles start slow then rush inward (gravity-pull feel)
              ease: 'easeIn',
              times: [0, 0.15, 0.5, 0.75, 1],
            }}
          />
        );
      })}

      {/* Particles earned in reflection: start at the screen sides and flow into Pip */}
      {earnedParticles.map((p, i) => {
        // Offsets from screen center (Pip), converted from the stored screen percentages
        const startX = `${p.xPct - 50}vw`;
        const startY = `${p.yPct - 50}vh`;
        const delay = 0.2 + (i / Math.max(earnedParticles.length, 1)) * 1.4 + Math.random() * 0.2;

        return (
          <motion.div
            key={`earned-${p.id}`}
            className="absolute rounded-full bg-white blur-[1px]"
            style={{
              width: p.size,
              height: p.size,
              boxShadow: '0 0 15px 2px rgba(254, 249, 195, 0.9)',
              zIndex: 6,
            }}
            initial={{ x: startX, y: startY, opacity: 1, scale: 1 }}
            animate={{
              x: 0,
              y: 0,
              opacity: [1, 1, 0.8, 0],
              scale: [1, 1.1, 0.7, 0],
            }}
            transition={{
              duration: 1.4 + Math.random() * 0.6,
              delay,
              ease: 'easeIn',
              times: [0, 0.3, 0.75, 1],
            }}
          />
        );
      })}

      {/* Pip — glow builds up as energy is absorbed */}
      <motion.div
        className="absolute"
        style={{ zIndex: 10 }}
        animate={{
          filter: [
            'drop-shadow(0 0 0px rgba(255, 248, 212, 0))',
            'drop-shadow(0 0 8px rgba(255, 248, 212, 0.45))',
            'drop-shadow(0 0 28px rgba(255, 248, 212, 0.9)) drop-shadow(0 0 55px rgba(255, 220, 100, 0.55))',
          ],
        }}
        transition={{ duration: 3.5, times: [0, 0.35, 1], ease: 'easeIn' }}
      >
        <MotionPipImage
          className="w-(--pip-cutscene-size) h-auto"
          animate={{ y: [0, -8, 0, -6, 0] }}
          transition={{
            delay: 0.2,
            duration: 2.0,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
            times: [0, 0.25, 0.5, 0.75, 1],
          }}
        />
      </motion.div>

    </div>
  );
};
