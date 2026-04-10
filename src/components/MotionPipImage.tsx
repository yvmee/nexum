import React, { forwardRef } from 'react';
import * as motion from 'motion/react-client';
import { useGameStore } from '../store/useGameStore';
import { pipSprite } from './PipImage';

type MotionImgProps = React.ComponentProps<typeof motion.img>;

interface MotionPipImageProps extends MotionImgProps {
  extraFilter?: string;
}

/**
 * Motion-compatible version of Pip image for animations
 */
export const MotionPipImage = forwardRef<HTMLImageElement, MotionPipImageProps>(
  ({ extraFilter, style, ...props }, ref) => {
    const pipColorValue = useGameStore((state) => state.pipColorValue);
    const grayscale = 100 - pipColorValue;
    const filter = extraFilter
      ? `grayscale(${grayscale}%) ${extraFilter}`
      : `grayscale(${grayscale}%)`;

    return (
      <motion.img
        ref={ref}
        src={pipSprite}
        alt="Pip"
        {...props}
        style={{ ...style, filter }}
      />
    );
  }
);
