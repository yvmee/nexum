import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { ReflectionNode, UserResponse, reflectionDialogues } from '../../storydata/reflectionData';
import { ReflectionDialogueBox } from './ReflectionDialogueBox';
import { ThoughtBubbles } from './ThoughtBubbles';
import { loadReflectionAnswerTexts, saveData, ReflectionAnswerData } from '../../db/database';
import SchoolBackground from '../../../assets/SchoolBackground.png';
import LectureHall from '../../../assets/backgrounds/LectureHall.png';

// Set scene relevant variables
let activeDialogues = reflectionDialogues[0]; // Only one option for now
let currentBackground = LectureHall;

// 
let session = 5; // This should be set based on the scenario the user just completed, to load the relevant dialogue and background

// Helper function to find a dialogue node by its id
function findNode(id: string): ReflectionNode | undefined {
  return activeDialogues.find((n) => n.id === id);
}

/**
 * Reflection scene driven by reflectionData
 */
export const ReflectionScene: React.FC = () => {
  const [currentDialogue, setCurrentDialogue] = useState<ReflectionNode | null>(null);
  const [isDialogueVisible, setIsDialogueVisible] = useState<boolean>(true);
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

      // Start with the first node from reflectionDialogues
      const firstNode = activeDialogues[0];
      if (firstNode) {
        setCurrentDialogue(firstNode);
      }
    };

    initializeReflection();
  }, []);


  // Advance to a node by its id
  const advanceToNode = (nodeId: string | undefined) => {
    if (!nodeId) {
      setIsDialogueVisible(false);
      console.log('Reflection complete. User responses:', userResponses);
      useGameStore.getState().completeReflection();
      return;
    }
    const node = findNode(nodeId);
    if (node) {
      setCurrentDialogue(node);
      setShowThoughtBubbles(node.showBubbles === true);
      setIsAwaitingInput(false);
    } else {
      // Node not found –> end dialogue
      setIsDialogueVisible(false);
      console.log('Wrong node id provided. Ending reflection.');
      useGameStore.getState().completeReflection();
    }
  };

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
      advanceToNode(currentDialogue.nextId);
      return;
    }

    // If this dialogue requires input, wait for input instead of advancing
    if (currentDialogue.requiresInput && !isAwaitingInput) {
      setIsAwaitingInput(true);
      return;
    }

    advanceToNode(currentDialogue.nextId);
  };

  const handleSubmitInput = async (input: string) => {
    if (!currentDialogue) return;

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

    advanceToNode(currentDialogue.nextId);
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
      {/* <div className="flex flex-row justify-center h-full items-end pb-8">
        <img
          className="z-10 object-contain scale-[90%] max-w-full max-h-[50%]"
          src="../../assets/Sphere.png"
          alt="sphere"
        />
      </div> */}
    </div>
  );
};
