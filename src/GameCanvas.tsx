import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
}

/**
 * GameCanvas - React component for rendering the game canvas with stars and title
 */
export const GameCanvas: React.FC = (children) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Generate stars only once
    if (starsRef.current.length === 0) {
      starsRef.current = generateStars(100, canvas.width, canvas.height);
    }

    // Render the scene
    renderScene(ctx, canvas, starsRef.current);

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      starsRef.current = generateStars(100, canvas.width, canvas.height);
      renderScene(ctx, canvas, starsRef.current);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const generateStars = (
    count: number,
    width: number,
    height: number
  ): Star[] => {
    const stars: Star[] = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 1,
      });
    }
    return stars;
  };

  const renderScene = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    stars: Star[]
  ): void => {
    // Draw background
    ctx.fillStyle = '#16213e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars
    ctx.fillStyle = '#ffffff';
    for (const star of stars) {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw game title
    ctx.fillStyle = '#e94560';
    ctx.font = 'bold 48px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText('NEXUM', canvas.width / 2, 150);

    // Draw subtitle
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Segoe UI';
    ctx.fillText('A Browser Game Prototype', canvas.width / 2, 190);
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full bg-nexum-canvas"
    /> 
  );
};
