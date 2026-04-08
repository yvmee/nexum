import React from 'react';
import { SceneNode } from '../../storydata/dialogueData';
import { PaperTableGame } from './PaperTableGame';
import { SortingGame } from './SortingGame';

interface MinigameProps {
  node: SceneNode;
  onComplete: () => void;
}

export const MinigameManager: React.FC<MinigameProps> = ({ node, onComplete }) => {
  
  // Route to specific minigame component based on minigameId
  switch (node.minigameId) {
    case 'paper_table':
      return <PaperTableGame onComplete={onComplete} />;

    case 'sorting_game':
      return <SortingGame onComplete={onComplete} />;

      
    default:
      // Failsafe for missing Ids
      console.warn(`Minigame ID ${node.animationId} not found.`);
      onComplete(); 
      return null;
  }
};