import React, { useEffect, useMemo } from 'react';
import * as motion from "motion/react-client"

interface LightFlashSceneProps {
	onComplete: () => void;
}

export const LightFlashScene: React.FC<LightFlashSceneProps> = ({ onComplete }) => {

	useEffect(() => {
		const timer = setTimeout(onComplete, 1700);
		return () => clearTimeout(timer);
	}, [onComplete]);

	const shockStreaks = useMemo(() => {
		return Array.from({ length: 14 }).map((_, i) => {
			const fromLeft = i % 2 === 0;

			return {
				id: i,
				fromLeft,
				top: Math.random() * 100,
				width: Math.random() * 45 + 55,
				height: Math.random() * 5 + 2,
				delay: Math.random() * 0.32,
				duration: Math.random() * 0.2 + 0.25,
			};
		});
	}, []);

	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none">
			{/* Initial white-out hit */}
			<motion.div
				className="absolute inset-0"
				style={{
					background:
						'radial-gradient(circle at 50% 50%, rgba(255,255,255,1) 0%, rgba(255,248,220,0.97) 35%, rgba(255,232,160,0.65) 62%, rgba(255,232,160,0) 100%)',
					filter: 'blur(4px)'
				}}
				initial={{ opacity: 0, scale: 0.25 }}
				animate={{ opacity: [0, 1, 0.84, 0], scale: [0.25, 1.15, 1.25, 1.45] }}
				transition={{ duration: 1.3, times: [0, 0.1, 0.35, 1], ease: 'easeOut' }}
			/>

			{/* Horizontal shock streaks that slash across the screen */}
			{shockStreaks.map((streak) => (
				<motion.div
					key={streak.id}
					className="absolute"
					style={{
						top: `${streak.top}%`,
						width: `${streak.width}vw`,
						height: `${streak.height}vh`,
						borderRadius: '9999px',
						background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 30%, rgba(255,246,190,0.9) 70%, rgba(255,255,255,0) 100%)',
						boxShadow: '0 0 36px 8px rgba(255,248,212,0.95), 0 0 90px 20px rgba(255,255,255,0.7)',
						mixBlendMode: 'screen'
					}}
					initial={{
						x: streak.fromLeft ? '-130vw' : '130vw',
						opacity: 0,
						scaleX: 0.75,
						rotate: streak.fromLeft ? -5 : 5
					}}
					animate={{
						x: streak.fromLeft ? '130vw' : '-130vw',
						opacity: [0, 1, 0.2, 0],
						scaleX: [0.75, 1.35, 0.95],
						rotate: streak.fromLeft ? [-5, -2, 0] : [5, 2, 0]
					}}
					transition={{
						delay: streak.delay,
						duration: streak.duration,
						ease: 'easeOut',
						times: [0, 0.2, 0.65, 1]
					}}
				/>
			))}

			{/* Flicker aftershock */}
			<motion.div
				className="absolute inset-0 bg-white"
				initial={{ opacity: 0 }}
				animate={{ opacity: [0, 0.9, 0.18, 0.7, 0] }}
				transition={{ delay: 0.08, duration: 0.85, times: [0, 0.2, 0.45, 0.62, 1], ease: 'easeInOut' }}
			/>
		</div>
	);
};

