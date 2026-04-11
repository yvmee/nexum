import React from 'react';
import { useGameStore } from '../store/useGameStore';
import pipSprite from '../../assets/characters/Sphere.png';

export { pipSprite };

interface PipImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  // Extra CSS filter to combine with grayscale 
  extraFilter?: string;
}

/**
 * Global Pip image component that automatically applies the grayscale filter based on pipColorValue from the game store.
 * Should be used instead of the .png
 */
export const PipImage: React.FC<PipImageProps> = ({ extraFilter, style, ...props }) => {
  const pipColorValue = useGameStore((state) => state.pipColorValue);
  const grayscale = 100 - pipColorValue;
  const filter = extraFilter
    ? `grayscale(${grayscale}%) ${extraFilter}`
    : `grayscale(${grayscale}%)`;

  return (
    <img
      src={pipSprite}
      alt="Pip"
      {...props}
      style={{ ...style, filter }}
    />
  );
};
