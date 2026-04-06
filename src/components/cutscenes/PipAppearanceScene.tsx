import React, { useEffect, useMemo } from 'react';
import * as motion from "motion/react-client";
import pipSprite from '../../../assets/characters/Sphere.png';

interface PipAppearanceSceneProps {
    onComplete: () => void;
}

export const PipAppearanceScene: React.FC<PipAppearanceSceneProps> = ({ onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(onComplete, 2800);
        return () => clearTimeout(timer);
    }, [onComplete]);

    const streaks = useMemo(() => {
        return Array.from({ length: 10 }).map((_, i) => {
            const fromLeft = i % 2 === 0;

            return {
                id: i,
                fromLeft,
                top: Math.random() * 100,
                width: Math.random() * 35 + 45,
                height: Math.random() * 3 + 1.5,
                delay: Math.random() * 0.25,
                duration: Math.random() * 0.18 + 0.2,
            };
        });
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
            {/* Keep a strong, warm flash behind Pip and let it fade while Pip settles in */}
            <motion.div
                className="absolute inset-0"
                style={{
                    background:
                        'radial-gradient(circle at 50% 55%, rgba(255,255,255,0.95) 0%, rgba(255,247,210,0.78) 33%, rgba(255,233,164,0.36) 60%, rgba(255,233,164,0) 100%)'
                }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: [0, 1, 0.55, 0.18], scale: [0.6, 1.08, 1.15, 1.2] }}
                transition={{ duration: 2.6, times: [0, 0.2, 0.55, 1], ease: 'easeOut' }}
            />

            {streaks.map((streak) => (
                <motion.div
                    key={streak.id}
                    className="absolute"
                    style={{
                        top: `${streak.top}%`,
                        width: `${streak.width}vw`,
                        height: `${streak.height}vh`,
                        borderRadius: '9999px',
                        background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 35%, rgba(255,246,190,0.85) 70%, rgba(255,255,255,0) 100%)',
                        boxShadow: '0 0 24px 5px rgba(255,248,212,0.8), 0 0 54px 14px rgba(255,255,255,0.55)',
                        mixBlendMode: 'screen'
                    }}
                    initial={{ x: streak.fromLeft ? '-120vw' : '120vw', opacity: 0, rotate: streak.fromLeft ? -4 : 4 }}
                    animate={{
                        x: streak.fromLeft ? '120vw' : '-120vw',
                        opacity: [0, 0.85, 0.15, 0],
                        rotate: streak.fromLeft ? [-4, -1, 0] : [4, 1, 0]
                    }}
                    transition={{
                        delay: streak.delay,
                        duration: streak.duration,
                        ease: 'easeOut',
                        times: [0, 0.24, 0.72, 1]
                    }}
                />
            ))}

            <motion.div
                className="absolute"
                initial={{ opacity: 0, scale: 0.3, y: 22, filter: 'blur(5px)' }}
                animate={{ opacity: [0, 1], scale: [0.3, 1], y: [22, 0], filter: ['blur(5px)', 'blur(0px)'] }}
                transition={{ duration: 0.65, delay: 0.16, ease: 'easeOut' }}
            >
                <motion.img
                    src={pipSprite}
                    alt="Pip"
                    className="w-45 h-auto drop-shadow-[0_0_24px_rgba(255,248,212,0.95)]"
                    animate={{ y: [0, -8, 0, -6, 0] }}
                    transition={{
                        delay: 0.8,
                        duration: 1.8,
                        repeat: Infinity,
                        repeatType: 'loop',
                        ease: 'easeInOut',
                        times: [0, 0.25, 0.5, 0.75, 1]
                    }}
                />
            </motion.div>
        </div>
    );
};

