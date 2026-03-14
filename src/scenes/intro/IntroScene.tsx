import React, { useState, useEffect } from 'react';
import { DialogueBox } from '../dialogue/DialogueBox.tsx';
import { DialogueNode } from '../../storydata/dialogueData.ts';
import { introText } from './textData.ts';
import SchoolBackground from '../../../assets/backgrounds/SchoolBackground.png';
import { useGameStore } from '../../store/useGameStore.ts';

// Set the active dialogue dataset
let activeDialogues = introText;
let currentBackground = SchoolBackground;

const findDialogueById = (id: string): DialogueNode | null => {
  return activeDialogues.find((d) => d.id === id) || null;
};

/**
 * Intro scene that handles intro dialogue flow
 */
export const IntroScene: React.FC = () => {
  const [currentDialogue, setCurrentDialogue] = useState<DialogueNode | null>(null);
  const [isDialogueVisible, setIsDialogueVisible] = useState<boolean>(false);

  useEffect(() => {
    // Start with the first dialogue node (id: 'start')
    const startDialogue = findDialogueById('start');
    if (startDialogue) {
      setCurrentDialogue(startDialogue);
      setIsDialogueVisible(true);
    }
  }, []);


  // Advance to the next dialogue (for non-branching dialogues)
  const handleAdvance = (): void => {
    if (!currentDialogue) return;

    if (currentDialogue.nextId) {
      const nextDialogue = findDialogueById(currentDialogue.nextId);
      if (nextDialogue) {
        setCurrentDialogue(nextDialogue);
      } else {
        endDialogue();
      }
    } else {
      // No nextId means end of dialogue
      endDialogue();
    }
  };

  const endDialogue = (): void => {
    setIsDialogueVisible(false);
    console.log('Dialogue sequence completed!');
    // Change scene in SceneStore
    useGameStore.getState().setScene('STORY');
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
        {/* For spacing */}
        <div className="flex flex-col items-center justify-center mt-20"> </div>

        {/* Dialogue Box */}
        <div className="pointer-events-auto mb-10">
          <DialogueBox
            dialogue={currentDialogue}
            onAdvance={handleAdvance}
            onSelectOption={() => {}} // No branching in intro
            isVisible={isDialogueVisible}
          />
        </div>
      </div>
    </div>
  );
};
