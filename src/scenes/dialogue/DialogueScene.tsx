import React, { useState, useEffect } from 'react';
import { DialogueBox } from './DialogueBox.tsx';
import { DialogueNode } from '../../storydata/dialogueData.ts';
import { useGameStore } from '../../store/useGameStore.ts';
import { backgrounds } from '../../storydata/assetData.ts';

// Set scene relevant variables
let currentBackground = backgrounds.lectureHall;

/**
 * Dialogue scene that handles dialogue flow with branching support
 */
export const DialogueScene: React.FC = () => {
  const activeDialogues = useGameStore((state) => state.activeDialogues);
  const [currentDialogue, setCurrentDialogue] = useState<DialogueNode | null>(null);
  const [isDialogueVisible, setIsDialogueVisible] = useState<boolean>(false);
  const leftPortrait = currentDialogue?.characterLeft;
  const rightPortrait = currentDialogue?.characterRight;

  if (currentDialogue?.background) {
    currentBackground = backgrounds[currentDialogue.background as keyof typeof backgrounds] || currentBackground;
  }

  const findDialogueById = (id: string): DialogueNode | null =>
    activeDialogues.find((d) => d.id === id) || null;

  useEffect(() => {
    // Start with the first dialogue node when a new story chunk is activated
    const id = useGameStore.getState().startNodeId;
    const startDialogue = findDialogueById(id);
    if (startDialogue) {
      setCurrentDialogue(startDialogue);
      setIsDialogueVisible(true);
    }
  }, [activeDialogues]);

  // Advance to the next dialogue for non-branching nodes
  const handleAdvance = (): void => {
    if (!currentDialogue) return;

    if (currentDialogue.nextId) {
      const nextDialogue = findDialogueById(currentDialogue.nextId);
      if (nextDialogue) {
        setCurrentDialogue(nextDialogue);
        // check if the background should change with the new dialogue
        if (nextDialogue.background) {
          currentBackground = backgrounds[nextDialogue.background as keyof typeof backgrounds] || currentBackground;
        }
      } else {
        endDialogue();
      }
    } else {
      // No nextId means end of dialogue
      endDialogue();
    }
  };


  // Handle player selecting a dialogue option for dialogue branching
  const handleSelectOption = (nextId: string, choice?: Record<string, string | boolean | number>): void => {
    if (choice) { // Save the selected choice in game manager for chunk branching
      useGameStore.getState().makeChoice(Object.keys(choice)[0], Object.values(choice)[0]);
    }

    const nextDialogue = findDialogueById(nextId);
    if (nextDialogue) {
      setCurrentDialogue(nextDialogue);
      if (nextDialogue.background) {
        currentBackground = backgrounds[nextDialogue.background as keyof typeof backgrounds] || currentBackground;
      }
    } else {
      endDialogue();
    }
  };


  // End the dialogue sequence and transition to reflection 
  const endDialogue = (): void => {
    setIsDialogueVisible(false);
    console.log('Dialogue sequence completed!');
    useGameStore.getState().completeChunk();
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
              <div className="min-h-[clamp(100px,16vh,190px)] flex items-end">
                {leftPortrait && (
                  <img
                    src={leftPortrait}
                    alt={`${currentDialogue?.speaker ?? 'Character'} portrait`}
                    className="h-[clamp(100px,16vh,190px)] w-auto object-contain drop-shadow-lg"
                  />
                )}
              </div>
              <div className="min-h-[clamp(300px,32vh,600px)] flex items-end justify-end">
                {rightPortrait && (
                  <img
                    src={rightPortrait}
                    alt={`${currentDialogue?.speaker ?? 'Character'} portrait`}
                    className="h-[clamp(300px,32vh,600px)] w-auto object-contain drop-shadow-lg"
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
