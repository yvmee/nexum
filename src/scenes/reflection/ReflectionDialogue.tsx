import React, { useState, useEffect } from 'react';
import * as ChoicesManager from '../dialogue/ChoicesManager';
import { ReflectionNode, UserResponse, reflectionDialogues } from './reflectionData';
import { ReflectionDialogueBox } from './ReflectionDialogueBox';
import { ThoughtBubbles } from './ThoughtBubbles';
import { loadReflectionAnswerTexts, saveData, ReflectionAnswerData } from '../../db/database';
import SchoolBackground from '../../../assets/SchoolBackground.png';
import LectureHall from '../../../assets/LectureHall.png';

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
 * ReflectionDialogue - Main component for reflection scene driven by reflectionData
 */
export const ReflectionDialogue: React.FC = () => {
  const [currentDialogue, setCurrentDialogue] = useState<ReflectionNode | null>(null);
  const [isDialogueVisible, setIsDialogueVisible] = useState<boolean>(true);
  const [isAwaitingInput, setIsAwaitingInput] = useState<boolean>(false);
  const [userResponses, setUserResponses] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [previousReflections, setPreviousReflections] = useState<ReflectionAnswerData[]>([]);
  const [showThoughtBubbles, setShowThoughtBubbles] = useState<boolean>(false);
  const [canContinue, setCanContinue] = useState<boolean>(true);
  const [showingAIResponse, setShowingAIResponse] = useState<boolean>(false);
  const [nextNodeAfterAI, setNextNodeAfterAI] = useState<string | undefined>(undefined);

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

  // Scene initialisation
  useEffect(() => {
    const initializeReflection = async () => {
      console.debug('Selected choice in ReflectionDialogue:', ChoicesManager.currentChoiceScenario);

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

      // Set up AI context if a choice was made 
      // if (ChoicesManager.currentChoiceScenario !== null) {
      //   try {
      //     const scenario = ChoicesManager.currentChoiceScenario.situation;
      //     let decisions = '';
      //     for (let i = 0; i < ChoicesManager.choiceIndeces.length; i++) {
      //       const option = ChoicesManager.currentChoiceScenario.choices[i][ChoicesManager.choiceIndeces[i]];
      //       decisions += option + ' ';
      //     }
      //     // Initialise AI context 
      //     await setUpAI(scenario, decisions);
      //   } catch (error) {
      //     console.error('Error initializing AI context:', error);
      //   }
      // }
    };

    initializeReflection();
  }, []);


  // Advance to a node by its id. If id is undefined the dialogue ends.
  const advanceToNode = (nodeId: string | undefined) => {
    if (!nodeId) {
      setIsDialogueVisible(false);
      console.log('Reflection complete. User responses:', userResponses);
      return;
    }
    const node = findNode(nodeId);
    if (node) {
      setCurrentDialogue(node);
      setShowThoughtBubbles(node.showBubbles === true);
      setIsAwaitingInput(false);
      setShowingAIResponse(false);
    } else {
      // Node not found – end dialogue
      setIsDialogueVisible(false);
    }
  };

  const handleAdvance = () => {
    if (!currentDialogue) return;

    // If thought bubbles are showing, dismiss them on click (when timer allows)
    if (showThoughtBubbles && canContinue) {
      // If this node also requires input, show input field while keeping bubbles visible
      if (currentDialogue.requiresInput && !isAwaitingInput) {
        setIsAwaitingInput(true);
        return;
      }
      setShowThoughtBubbles(false);
      if (!showingAIResponse) {
        advanceToNode(currentDialogue.nextId);
      }
      return;
    }

    // If we are showing an AI response, dismiss it and go to the saved next node
    if (showingAIResponse) {
      advanceToNode(nextNodeAfterAI);
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

    // If this node requests an AI response, generate one and show it as intermediate text
    // if (currentDialogue.generateAIResponse) {
    //   setIsLoading(true);
    //   try {
    //     const aiResponse = await generateResponse(input);
    //     setCurrentDialogue({
    //       id: `ai_response_${currentDialogue.id}`,
    //       text: aiResponse,
    //     });
    //     setShowingAIResponse(true);
    //     setNextNodeAfterAI(currentDialogue.nextId);
    //   } catch (error) {
    //     console.error('Error getting AI response:', error);
    //     setCurrentDialogue({
    //       id: `ai_response_${currentDialogue.id}`,
    //       text: 'I appreciate your thoughts. Let\'s continue reflecting.',
    //     });
    //     setShowingAIResponse(true);
    //     setNextNodeAfterAI(currentDialogue.nextId);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // } else {
    //   // No AI response needed –> advance to the next node
    //   advanceToNode(currentDialogue.nextId);
    // }
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
        {isLoading ? (
          <div className="flex flex-col z-10 justify-center items-center gap-[var(--box-gap)] w-[var(--box-width)] max-w-[90vw] min-h-[var(--box-min-height)] bg-gradient-to-br from-[var(--chart-3)]/95 via-[var(--chart-4)]/95 to-[var(--chart-5)]/95 border-2 border-border rounded-xl p-[var(--box-padding)]">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-[var(--spinner-size)] w-[var(--spinner-size)] border-b-2 border-primary"></div>
              <span className="text-[var(--text-body)] text-foreground font-medium">Thinking...</span>
            </div>
          </div>
        ) : (
          <ReflectionDialogueBox
            dialogue={currentDialogue}
            onAdvance={handleAdvance}
            onSubmitInput={handleSubmitInput}
            isVisible={isDialogueVisible}
            isAwaitingInput={isAwaitingInput}
            canContinue={canContinue}
          />
        )}
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
