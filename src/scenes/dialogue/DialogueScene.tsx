import React from 'react';
import { DialogueBox } from './DialogueBox.tsx';
import { useGameStore, useCurrentDialogue } from '../../store/useGameStore.ts';

/**
 * Dialogue scene that handles dialogue flow with branching support
 */
export const DialogueScene: React.FC = () => {
  const currentBackground = useGameStore((state) => state.currentBackground);
  const advanceDialogue = useGameStore((state) => state.advanceDialogue);
  const makeChoice = useGameStore((state) => state.makeChoice);

  const currentDialogue = useCurrentDialogue();

  const isDialogueVisible = currentDialogue !== null;
  const leftPortrait = currentDialogue?.characterLeft;
  const rightPortrait = currentDialogue?.characterRight;

  // Advance to the next dialogue for non-branching nodes
  const handleAdvance = (): void => {
    advanceDialogue();
  };

  // Handle player selecting a dialogue option for dialogue branching
  const handleSelectOption = (nextId: string, choice?: Record<string, string | boolean | number>): void => {
    if (choice) { // Save the selected choice in game manager for chunk branching
      makeChoice(Object.keys(choice)[0], Object.values(choice)[0]);
    }
    advanceDialogue(nextId);
  };

  return (
    <div className="w-full h-full">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <img 
          src={currentBackground} 
          alt="Background" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-center justify-between w-full h-full p-8 pointer-events-none">
        <div className="flex flex-col items-center justify-center mt-20"></div>
        {/* Dialogue Box Area */}
        <div className="pointer-events-auto mb-10 flex flex-col items-center w-full">
          {/* Optional Speaker Portraits */}
          {isDialogueVisible && (leftPortrait || rightPortrait) && (
            <div className="w-[var(--box-width)] max-w-[90vw] mb-3 px-2 flex items-end justify-between">
              <div className="min-h-(--portrait-size) flex items-end">
                {leftPortrait && (
                  <img
                    src={leftPortrait}
                    alt={`${currentDialogue?.speaker ?? 'Character'} portrait`}
                    className="h-(--portrait-size) w-auto object-contain drop-shadow-lg"
                  />
                )}
              </div>
              <div className="min-h-(--portrait-size) flex items-end justify-end">
                {rightPortrait && (
                  <img
                    src={rightPortrait}
                    alt={`${currentDialogue?.speaker ?? 'Character'} portrait`}
                    className="h-(--portrait-size) w-auto object-contain drop-shadow-lg"
                  />
                )}
              </div>
            </div>
          )}
          <DialogueBox
            dialogue={currentDialogue}
            onAdvance={handleAdvance}
            onSelectOption={handleSelectOption}
            isVisible={isDialogueVisible}
          />
        </div>
      </div>
    </div>
  );
};
