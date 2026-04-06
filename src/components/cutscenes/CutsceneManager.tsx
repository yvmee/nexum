import React from 'react';
import { GlowParticleScene } from './GlowParticleScene';
import { SceneNode } from '../../storydata/dialogueData';

interface CutsceneProps {
  node: SceneNode;
  onComplete: () => void;
}

export const CutsceneManager: React.FC<CutsceneProps> = ({ node, onComplete }) => {
  
  // Route to specific animation component based on animationId
  switch (node.animationId) {
    case 'glow_burst':
      return <GlowParticleScene onComplete={onComplete} />;
      
    default:
      // Failsafe for missing Ids
      console.warn(`Animation ID ${node.animationId} not found.`);
      onComplete(); 
      return null;
  }
};