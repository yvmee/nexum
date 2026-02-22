import React, { useState, useEffect } from 'react';
// import { GameCanvas } from './GameCanvas';
import { DialogueBox } from './DialogueBox';
import { scenario5Dialogue, tutorAcademyDialogues, DialogueNode } from './DialogueData.ts';
import { useNavigate } from 'react-router-dom';
import * as ChoicesManager from './ChoicesManager';
import SchoolBackground from '../../../assets/SchoolBackground.png';
import LectureHall from '../../../assets/LectureHall.png';

// Set the active dialogue dataset
let activeDialogues = scenario5Dialogue;
let currentBackground = LectureHall;
let choiceIndeces: number[] = []; // Track the indices of choices made
/**
 * Helper to find a dialogue node by ID
 */
const findDialogueById = (id: string): DialogueNode | null => {
  return activeDialogues.find((d) => d.id === id) || null;
};

/**
 * LayoutDialogue component - handles dialogue flow with branching support
 */
export const LayoutDialogue: React.FC = () => {
  const [currentDialogue, setCurrentDialogue] = useState<DialogueNode | null>(null);
  const [isDialogueVisible, setIsDialogueVisible] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Start with the first dialogue node (id: 'start')
    const startDialogue = findDialogueById('start');
    if (startDialogue) {
      setCurrentDialogue(startDialogue);
      setIsDialogueVisible(true);
    }
  }, []);

  /**
   * Advance to the next dialogue (for non-branching dialogues)
   */
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

  /**
   * Handle player selecting a dialogue option (for branching)
   */
  const handleSelectOption = (nextId: string, choiceKey?: ChoicesManager.TutorialChoice): void => {
    // Set the selected choice if a choiceKey is provided
    if (choiceKey !== undefined) {
      //ChoicesManager.setChoice(choiceKey);
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

  /**
   * End the dialogue sequence
   */
  const endDialogue = (): void => {
    setIsDialogueVisible(false);
    console.log('Dialogue sequence completed!');
    // Set choice indeces in ChoicesManager for reflection scene
    ChoicesManager.setChoiceIndeces(choiceIndeces);
    choiceIndeces = []; // Reset for next time
    // Navigate to reflection scene
    navigate('/reflection');
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
