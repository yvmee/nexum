import React, { useState, useEffect } from 'react';
import { DialogueBox } from '../dialogue/DialogueBox';
import { DialogueNode } from '../dialogue/DialogueData';
import { introText } from './TextData';
import SchoolBackground from '../../../assets/SchoolBackground.png';
import LectureHall from '../../../assets/LectureHall.png';
import { useSceneStore } from '../../store/useSceneStore';

// Set the active dialogue dataset
let activeDialogues = introText;
let currentBackground = SchoolBackground;
/**
 * Helper to find a dialogue node by ID
 */
const findDialogueById = (id: string): DialogueNode | null => {
  return activeDialogues.find((d) => d.id === id) || null;
};

/**
 * LayoutDialogue component - handles dialogue flow with branching support
 */
export const Intro: React.FC = () => {
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
   * End the dialogue sequence
   */
  const endDialogue = (): void => {
    setIsDialogueVisible(false);
    console.log('Dialogue sequence completed!');
    // Change scene in SceneStore
    useSceneStore.getState().setScene('STORY');
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
        {/* Game Title & Subtitle */}
        <div className="flex flex-col items-center justify-center mt-20">
          <h1 className="text-primary font-bold text-6xl mb-4" style={{ fontFamily: 'Segoe UI' }}>
            NEXUM
          </h1>
        </div>

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
