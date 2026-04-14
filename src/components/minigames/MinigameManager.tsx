import React from 'react';
import { SceneNode } from '../../storydata/dialogueData';
import { PaperTableGame, Paper } from './PaperTableGame';
import { SortingGame } from './SortingGame';
import { useGameStore } from '../../store/useGameStore';

interface MinigameProps {
  node: SceneNode;
  onComplete: () => void;
}

export const PAPERS_START: Paper[] = [ // Paper text data 
  { id: 1, title: 'Motivate Your Students!', text: 'Bring along visual aids or establish a practical connection.\n\nUse your own enthusiasm for the topic to interest the students in the subject and the content being covered.', 
      x: '60%', y: '40%', rotate: 25 },
  { id: 2, title: 'A Positive Atmosphere ', text: 'Create a positive atmosphere by approaching students with openness. Create eye contact and use open facial expressions and gestures. Take their wishes and concerns seriously. This isn’t the place for fearmongering, irony or sarcasm.', 
      x: '35%', y: '20%', rotate: 5 },
  { id: 3, title: 'Structure', text: 'At the beginning of the tutorial, provide an overview of the topics to be covered. An agenda, a simple list, a mind map, or a learning map are great options for this.\n\nSpecifically state the learning outcomes your event should achieve so that students know what learning gains they can expect.\n\n At the beginning of each lesson, make a connection to the previous one in order to build on the students\' prior knowledge. You can use a mind map, cluster or a quiz for this.', 
      x: '10%', y: '30%', rotate: -15 },
];

export const PAPERS_EXEC: Paper[] = [ // Paper text data 
  { id: 1, title: 'Motivate Your Students!', text: 'Bring along visual aids or establish a practical connection.\n\nUse your own enthusiasm for the topic to interest the students in the subject and the content being covered.', 
      x: '60%', y: '40%', rotate: 25 },
  { id: 2, title: 'A Positive Atmosphere ', text: 'Create a positive atmosphere by approaching students with openness. Create eye contact and use open facial expressions and gestures. Take their wishes and concerns seriously. This isn’t the place for fearmongering, irony or sarcasm.', 
      x: '35%', y: '20%', rotate: 5 },
  { id: 3, title: 'Structure', text: 'At the beginning of the tutorial, provide an overview of the topics to be covered. An agenda, a simple list, a mind map, or a learning map are great options for this.\n\nSpecifically state the learning outcomes your event should achieve so that students know what learning gains they can expect.\n\n At the beginning of each lesson, make a connection to the previous one in order to build on the students\' prior knowledge. You can use a mind map, cluster or a quiz for this.', 
      x: '10%', y: '30%', rotate: -15 },
];

export const MinigameManager: React.FC<MinigameProps> = ({ node, onComplete }) => {
  const submitSortingChoices = useGameStore((state) => state.submitSortingGame);
  
  // Route to specific minigame component based on minigameId
  switch (node.minigameId) {
    case 'paper_table':
      return <PaperTableGame onComplete={onComplete} papers={PAPERS_START} />;

    case 'paper_table_exec':
      return <PaperTableGame onComplete={onComplete} papers={PAPERS_EXEC} />;

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