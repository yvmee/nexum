import React from 'react';
import { SceneNode } from '../../storydata/dialogueData';
import { GlowParticleScene } from './GlowParticleScene';
import { LightFlashScene } from './LightFlashScene';
import { PipAppearanceScene } from './PipAppearanceScene';

interface CutsceneProps {
  node: SceneNode;
  onComplete: () => void;
}

export const CutsceneManager: React.FC<CutsceneProps> = ({ node, onComplete }) => {
  
  // Route to specific animation component based on animationId
  switch (node.animationId) {
    case 'glow_burst':
      return <GlowParticleScene onComplete={onComplete} />;

    case 'light_flash':
      return <LightFlashScene onComplete={onComplete} />;

    case 'pip_appearance_flash':
      return <PipAppearanceScene onComplete={onComplete} />;
      
    default:
      // Failsafe for missing Ids
      console.warn(`Animation ID ${node.animationId} not found.`);
      onComplete(); 
      return null;
  }
};