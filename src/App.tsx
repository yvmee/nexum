import React, { useState, useEffect } from 'react';
import { GameCanvas } from './GameCanvas';
import { DialogueBox } from './DialogueBox';
import './style.css';

/**
 * Main App component for the Nexum game
 */
export const App: React.FC = () => {
  const [dialogues] = useState<string[]>([
    'Welcome to Nexum, brave adventurer!',
    'This is a prototype browser game built with TypeScript.',
    'You can click through these dialogue boxes to advance the story.',
    'Each click will reveal the next piece of text.',
    'When you reach the end, the dialogue box will close automatically.',
    'Thanks for playing! Click to close this dialogue.',
  ]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isDialogueVisible, setIsDialogueVisible] = useState<boolean>(false);

  useEffect(() => {
    // Show dialogue after component mounts
    setIsDialogueVisible(true);
  }, []);

  const handleAdvance = (): void => {
    const nextIndex = currentIndex + 1;

    if (nextIndex >= dialogues.length) {
      setIsDialogueVisible(false);
      console.log('Dialogue sequence completed!');
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  return (
    <div className="bg-nexum-bg flex justify-center items-center min-h-screen font-sans">
      <div className="relative w-[800px] h-[600px]">
        <GameCanvas />
        <DialogueBox
          dialogues={dialogues}
          currentIndex={currentIndex}
          onAdvance={handleAdvance}
          isVisible={isDialogueVisible}
        />
      </div>
    </div>
  );
};
