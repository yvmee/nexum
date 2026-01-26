import React, { useState, useEffect } from 'react';
import { GameCanvas } from './GameCanvas';
import { DialogueBox } from './DialogueBox';
import { gameDialogues } from './dialogueData';

/**
 * Layout component - provides the main layout structure for the app
 */
export const Layout: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isDialogueVisible, setIsDialogueVisible] = useState<boolean>(false);

  useEffect(() => {
    // Show dialogue after component mounts
    setIsDialogueVisible(true);
  }, []);

  const handleAdvance = (): void => {
    const nextIndex = currentIndex + 1;

    if (nextIndex >= gameDialogues.length) {
      setIsDialogueVisible(false);
      console.log('Dialogue sequence completed!');
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden font-sans bg-[#16213e]">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <GameCanvas />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-center justify-between w-full h-full p-8 pointer-events-none">
        {/* Game Title & Subtitle */}
        <div className="flex flex-col items-center justify-center mt-20">
          <h1 className="text-nexum-accent font-bold text-6xl mb-4" style={{ fontFamily: 'Segoe UI' }}>
            NEXUM
          </h1>
        </div>

        {/* Dialogue Box */}
        <div className="pointer-events-auto mb-10">
          <DialogueBox
            dialogues={gameDialogues}
            currentIndex={currentIndex}
            onAdvance={handleAdvance}
            isVisible={isDialogueVisible}
          />
        </div>
      </div>
    </div>
  );
};
