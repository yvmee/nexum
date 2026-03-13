import React, { useState, useEffect, use } from 'react';
import { DialogueBox } from './DialogueBox.tsx';
import { DialogueNode } from '../../storydata/dialogueData.ts';
import { useGameStore } from '../../store/useGameStore.ts';
import * as ChoicesManager from './ChoicesManager.ts';
import LectureHall from '../../../assets/backgrounds/LectureHall.png';

// Set scene relevant variables
let currentBackground = LectureHall;
let choiceIndeces: number[] = []; // To track the indices of choices made
let startingDialogueId = 'start'; // Default starting dialogue id, can be set by a manager

/**
 * Dialogue scene that handles dialogue flow with branching support
 */
export const DialogueScene: React.FC = () => {
  const activeDialogues = useGameStore((state) => state.activeDialogues);
  const [currentDialogue, setCurrentDialogue] = useState<DialogueNode | null>(null);
  const [isDialogueVisible, setIsDialogueVisible] = useState<boolean>(false);

  const findDialogueById = (id: string): DialogueNode | null =>
    activeDialogues.find((d) => d.id === id) || null;

  useEffect(() => {
    // Start with the first dialogue node (id: 'start')
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
      } else {
        endDialogue();
      }
    } else {
      // No nextId means end of dialogue
      endDialogue();
    }
  };


  // Handle player selecting a dialogue option (for branching)
  const handleSelectOption = (nextId: string, choiceKey?: number): void => {
    // Save the selected choice if a choiceKey is provided
    if (choiceKey !== undefined) {
      choiceIndeces.push(choiceKey);
      console.log('Selected choices:', choiceIndeces);
    }

    const nextDialogue = findDialogueById(nextId);
    if (nextDialogue) {
      setCurrentDialogue(nextDialogue);
    } else {
      endDialogue();
    }
  };


  // End the dialogue sequence and transition to reflection 
  const endDialogue = (): void => {
    setIsDialogueVisible(false);
    console.log('Dialogue sequence completed!');
    // ChoicesManager.setChoiceIndeces(choiceIndeces);
    // choiceIndeces = []; // Reset for next scene
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
        {/* Dialogue Box */}
        <div className="pointer-events-auto mb-10">
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
