import React, { useState, useEffect } from 'react';
import * as ChoicesManager from '../dialogue/ChoicesManager';
// import { GameCanvas } from '../dialogue/GameCanvas';
import { reflectionDialogues, ReflectionNode, UserResponse } from './reflectionData';
import { ReflectionDialogueBox } from './ReflectionDialogueBox';
import SchoolBackground from '../../../assets/SchoolBackground.png';


/**
 * ReflectionDialogue - Main component for reflection scene with star background
 */
export const ReflectionDialogue: React.FC = () => {
  const [currentDialogue, setCurrentDialogue] = useState<ReflectionNode | null>(null);
  const [isDialogueVisible, setIsDialogueVisible] = useState<boolean>(true);
  const [isAwaitingInput, setIsAwaitingInput] = useState<boolean>(false);
  const [userResponses, setUserResponses] = useState<UserResponse[]>([]);

  useEffect(() => {
    console.debug('Selected choice in ReflectionDialogue:', ChoicesManager.selectedChoice);
    // Start with the first dialogue
    const startDialogue = reflectionDialogues.find((d) => d.id === 'start');
    if (startDialogue) {
      setCurrentDialogue(startDialogue);
    }
  }, []);

  const handleAdvance = () => {
    if (!currentDialogue) return;

    // If this dialogue requires input, wait for input instead of advancing
    if (currentDialogue.requiresInput && !isAwaitingInput) {
      setIsAwaitingInput(true);
      return;
    }

    // Move to next dialogue
    if (currentDialogue.nextId) {
      const nextDialogue = reflectionDialogues.find((d) => d.id === currentDialogue.nextId);
      if (nextDialogue) {
        setCurrentDialogue(nextDialogue);
        setIsAwaitingInput(false);
      }
    } else {
      // End of dialogue
      setIsDialogueVisible(false);
      console.log('Reflection complete. User responses:', userResponses);
    }
  };

  const handleSubmitInput = (input: string) => {
    if (!currentDialogue) return;

    // Save the user's response
    const newResponse: UserResponse = {
      nodeId: currentDialogue.id,
      prompt: currentDialogue.text,
      response: input,
      timestamp: new Date(),
    };

    setUserResponses((prev) => {
      const updated = [...prev, newResponse];
      console.log('User responses updated:', updated);
      return updated;
    });

    // Move to next dialogue
    if (currentDialogue.nextId) {
      const nextDialogue = reflectionDialogues.find((d) => d.id === currentDialogue.nextId);
      if (nextDialogue) {
        setCurrentDialogue(nextDialogue);
        setIsAwaitingInput(false);
      }
    } else {
      setIsDialogueVisible(false);
    }
  };

  return (
    <div className="w-full h-full">
      {/* Star sky background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={SchoolBackground} 
          alt="School Background" 
          className="w-full h-full object-cover grayscale"
        />
      </div>

      {/* Dialogue box at the top */}
      <div className="absolute top-8 left-0 right-0 z-10 flex justify-center">
        <ReflectionDialogueBox
          dialogue={currentDialogue}
          onAdvance={handleAdvance}
          onSubmitInput={handleSubmitInput}
          isVisible={isDialogueVisible}
          isAwaitingInput={isAwaitingInput}
        />
      </div>

      {/* Character image */}
      <div className="flex flex-row justify-center h-full items-end pb-8">
        <img
          className="z-10 object-contain scale-[90%] max-w-full max-h-[50%]"
          src="../../assets/Sphere.png"
          alt="fairy image"
        />
      </div>
    </div>
  );
};
