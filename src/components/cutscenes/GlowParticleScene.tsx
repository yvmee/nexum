import React, { useEffect, useMemo } from 'react';
import * as motion from "motion/react-client"
import { useSoundStore } from '../../store/useSoundStore';

interface GlowParticleSceneProps {
  onComplete: () => void;
}

export const GlowParticleScene: React.FC<GlowParticleSceneProps> = ({ onComplete }) => {
  const playSfx = useSoundStore((s) => s.playSfx);

  useEffect(() => {
    playSfx('glow');
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Memoize random particle data so they don't recalculate on every render tick
  const particles = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      // Random angle in radians to shoot out in a full circle
      angle: Math.random() * Math.PI * 2,
      // Random distance to travel (between 50px and 350px)
      distance: Math.random() * 300 + 50,
      // Random size for the particle
      size: Math.random() * 8 + 4,
      // Random delay so they don't all spawn at the exact same millisecond
      delay: Math.random() * 0.4,
      // Varied animation duration
      duration: Math.random() * 1.5 + 2, 
    }));
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
      
      {/* Main Central Growing Glow */}
      <motion.div
        className="absolute rounded-full bg-yellow-100 mix-blend-screen blur-[80px]"
        initial={{ width: 0, height: 0, opacity: 0 }}
        animate={{ 
          // Animate through these keyframes
          width: ['0px', '200px', '800px'], 
          height: ['0px', '200px', '800px'],
          opacity: [0, 0.9, 0] 
        }}
        transition={{ 
          duration: 3.5, 
          ease: 'easeInOut',
          times: [0, 0.4, 1] // Timing distribution for the keyframes
        }}
      />

      {/* Shimmering Burst Particles */}
      {particles.map((p) => {
        // Calculate the final X and Y destinations
        const destX = Math.cos(p.angle) * p.distance;
        const destY = Math.sin(p.angle) * p.distance;

        return (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white blur-[1px]"
            style={{ 
              width: p.size, 
              height: p.size,
              boxShadow: '0 0 15px 2px rgba(254, 249, 195, 0.9)' // Light yellow inner glow
            }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{
              x: destX,
              y: destY,
              // The shimmering effect is created by pulsing the opacity up and down
              opacity: [0, 1, 0.3, 1, 0.2, 0], 
              scale: [0, 1, 0.8, 1.2, 1, 0]
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: 'easeOut',
              // Map the 6 values above to specific points in the animation timeline
              times: [0, 0.2, 0.4, 0.6, 0.8, 1] 
            }}
          />
        );
      })}
    </div>
  );
};