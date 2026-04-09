import React, { useState, useEffect } from 'react';
import { useGameStore, useCurrentReflection } from '../../store/useGameStore';
import { UserResponse } from '../../storydata/reflectionData';
import { ReflectionDialogueBox } from './ReflectionDialogueBox';
import { ThoughtBubbles } from './ThoughtBubbles';
import { loadReflectionAnswerTexts, saveData, ReflectionAnswerData } from '../../db/database';

// Set scene relevant variables
//let session = 5; 

/**
 * Reflection scene driven by reflectionData
 */
export const ReflectionScene: React.FC = () => {
  const currentBackground = useGameStore((state) => state.currentBackground);
  const advanceReflection = useGameStore((state) => state.advanceReflection);
  const submitReflection = useGameStore((state) => state.submitReflection);

  const currentDialogue = useCurrentReflection();
  const session = useGameStore((state) => state.session);

  const [isDialogueVisible, setIsDialogueVisible] = useState<boolean>(currentDialogue !== null);
  const [isAwaitingInput, setIsAwaitingInput] = useState<boolean>(false);
  const [userResponses, setUserResponses] = useState<UserResponse[]>([]);
  const [previousReflections, setPreviousReflections] = useState<ReflectionAnswerData[]>([]);
  const [showThoughtBubbles, setShowThoughtBubbles] = useState<boolean>(false);
  const [canContinue, setCanContinue] = useState<boolean>(true);

  // Start 3-second timeout when thought bubbles appear
  useEffect(() => {
    if (showThoughtBubbles) {
      setCanContinue(false);
      const timer = setTimeout(() => {
        setCanContinue(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showThoughtBubbles]);

  useEffect(() => {
    const initializeReflection = async () => {

      // Load previous reflection texts from database
      try {
        const loadedReflections = await loadReflectionAnswerTexts(session);
        setPreviousReflections(loadedReflections);
        console.log('Previous reflections loaded:', loadedReflections.length);
      } catch (error) {
        console.error('Error loading previous reflections:', error);
      }
    };

    initializeReflection();
  }, []);

  // Update visibility when current dialogue changes
  useEffect(() => {
    setIsDialogueVisible(currentDialogue !== null);
    setShowThoughtBubbles(currentDialogue?.showBubbles === true);
    setIsAwaitingInput(false);
  }, [currentDialogue]);

  const handleAdvance = () => {
    if (!currentDialogue) return;

    // If thought bubbles are showing, dismiss them on click (when timer allows) and continue to next node
    if (showThoughtBubbles && canContinue) {
      // If this node also requires input, show input field while keeping bubbles visible
      if (currentDialogue.requiresInput && !isAwaitingInput) {
        setIsAwaitingInput(true);
        return;
      }
      setShowThoughtBubbles(false);
      advanceReflection();
      return;
    }

    // If this dialogue requires input, wait for input instead of advancing
    if (currentDialogue.requiresInput && !isAwaitingInput) {
      setIsAwaitingInput(true);
      return;
    }

    advanceReflection();
  };

  const handleSubmitInput = async (input: string) => {
    if (!currentDialogue) return;

    // Save to the store so everything stays centralized
    submitReflection(currentDialogue.id, input);

    // Save the user's response to local state
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

    // Save the input to the database
    if (currentDialogue.saveResponse) {
      try {
        await saveData(input, session);
        console.log('User response saved to database');
      } catch (error) {
        console.error('Error saving user response to database:', error);
      }
    }

    setIsAwaitingInput(false);

    advanceReflection();
  };

  return (
    <div className="w-full h-full">
      <div className="absolute inset-0 z-0">
        <img 
          src={currentBackground} 
          alt="Background" 
          className="w-full h-full object-cover grayscale"
        />
      </div>

      {/* Blur overlay on background*/}
      {<div className="absolute inset-0 z-5 bg-black/10 backdrop-blur-[1px] pointer-events-none" />}

      {/* Dialogue box at the top */}
      <div className="absolute top-8 left-0 right-0 z-10 flex justify-center">
        <ReflectionDialogueBox
          dialogue={currentDialogue}
          onAdvance={handleAdvance}
          onSubmitInput={handleSubmitInput}
          isVisible={isDialogueVisible}
          isAwaitingInput={isAwaitingInput}
          canContinue={canContinue}
        />
      </div>

      {/* Thought Bubbles - shown after user input */}
      <ThoughtBubbles
        reflections={previousReflections}
        isVisible={showThoughtBubbles}
        maxBubbles={5}
      />
      
      {/* Character image */}
      {currentDialogue?.showCharacter === true && (
        <div className="flex flex-row justify-center h-full items-end pb-8">
          <img
            className="z-10 object-contain scale-[90%] max-w-full max-h-[50%]"
            src="../../assets/characters/Sphere.png"
            alt="sphere"
          />
        </div>
      )}
    </div>
  );
};
