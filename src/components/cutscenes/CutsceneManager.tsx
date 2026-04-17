import React, { useEffect } from 'react';
import { SceneNode } from '../../storydata/dialogueData';
import { GlowParticleScene } from './GlowParticleScene';
import { LightFlashScene } from './LightFlashScene';
import { PipAppearanceScene } from './PipAppearanceScene';
import { ClockScene } from './ClockScene';
import { EnergyGainScene } from './EnergyGainScene';
import { useSoundStore } from '../../store/useSoundStore';

interface CutsceneProps {
  node: SceneNode;
  onComplete: () => void;
}

export const CutsceneManager: React.FC<CutsceneProps> = ({ node, onComplete }) => {
  const duckBgm = useSoundStore((s) => s.duckBgm);
  const unduckBgm = useSoundStore((s) => s.unduckBgm);

  // Duck BGM while a cutscene is active, restore when done
  useEffect(() => {
    duckBgm();
    return () => unduckBgm();
  }, [duckBgm, unduckBgm]);

  const handleComplete = () => {
    unduckBgm();
    onComplete();
  };
  
  // Route to specific animation component based on animationId
  switch (node.animationId) {
    case 'glow_burst':
      return <GlowParticleScene onComplete={handleComplete} />;

    case 'light_flash':
      return <LightFlashScene onComplete={handleComplete} />;

    case 'pip_appearance_flash':
      return <PipAppearanceScene onComplete={handleComplete} />;

    case 'clock_spin':
      return <ClockScene onComplete={handleComplete} />;

    case 'energy_gain':
      return <EnergyGainScene onComplete={handleComplete} />;
      
    default:
      // Failsafe for missing Ids
      console.warn(`Animation ID ${node.animationId} not found.`);
      handleComplete(); 
      return null;
  }
};