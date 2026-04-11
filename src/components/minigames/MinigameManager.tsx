import React from 'react';
import { SceneNode } from '../../storydata/dialogueData';
import { PaperTableGame } from './PaperTableGame';
import { SortingGame } from './SortingGame';
import { useGameStore } from '../../store/useGameStore';

interface MinigameProps {
  node: SceneNode;
  onComplete: () => void;
}

export const MinigameManager: React.FC<MinigameProps> = ({ node, onComplete }) => {
  const submitSortingChoices = useGameStore((state) => state.submitSortingGame);
  
  // Route to specific minigame component based on minigameId
  switch (node.minigameId) {
    case 'paper_table':
      return <PaperTableGame onComplete={onComplete} />;

    case 'sorting_game':
      return <SortingGame onComplete={(choices) => {
        submitSortingChoices(choices);
        onComplete();
      }} />;

      
    default:
      // Failsafe for missing Ids
      console.warn(`Minigame ID ${node.animationId} not found.`);
      onComplete(); 
      return null;
  }
};