import React, { useState, useEffect } from 'react';
import * as ChoicesManager from '../dialogue/ChoicesManager';
// import { GameCanvas } from '../dialogue/GameCanvas';
import { ReflectionNode, UserResponse } from './reflectionData';
import { ReflectionDialogueBox } from './ReflectionDialogueBox';
import { ThoughtBubbles } from './ThoughtBubbles';
import { setUpAI, generateResponse } from './ProcessAnswers';
import { loadReflectionTexts, saveData, ReflectionData } from '../../db/database';
import SchoolBackground from '../../../assets/SchoolBackground.png';


/**
 * ReflectionDialogue - Main component for reflection scene with AI-driven reflection
 */
export const ReflectionDialogue: React.FC = () => {
  const [currentDialogue, setCurrentDialogue] = useState<ReflectionNode | null>(null);
  const [isDialogueVisible, setIsDialogueVisible] = useState<boolean>(true);
  const [isAwaitingInput, setIsAwaitingInput] = useState<boolean>(false);
  const [userResponses, setUserResponses] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [conversationCount, setConversationCount] = useState<number>(0);
  const [previousReflections, setPreviousReflections] = useState<ReflectionData[]>([]);
  const [showThoughtBubbles, setShowThoughtBubbles] = useState<boolean>(false);
  const [pendingAIResponse, setPendingAIResponse] = useState<string | null>(null);
  const [canContinue, setCanContinue] = useState<boolean>(true);
  const maxConversations = 3; // Number of reflection exchanges before ending

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
      console.debug('Selected choice in ReflectionDialogue:', ChoicesManager.currentChoice);
      
      // Load all previous reflection texts at the beginning
      try {
        const loadedReflections = await loadReflectionTexts();
        setPreviousReflections(loadedReflections);
        console.log('Previous reflections loaded:', loadedReflections.length);
      } catch (error) {
        console.error('Error loading previous reflections:', error);
      }
      
      // Check if we have a valid choice selection
      if (ChoicesManager.currentChoice === null) {
        console.warn('No choice selected, using default scenario');
        setCurrentDialogue({
          id: 'error',
          text: 'No scenario found. Please complete the dialogue first.',
        });
        setIsLoading(false);
        return;
      }

      try {
        // Get the scenario and the student's decision
        const scenario = ChoicesManager.currentChoice.situation;
        let decisions = "";
        for (let i = 0; i < ChoicesManager.choiceIndeces.length; i++) {
          const option = ChoicesManager.currentChoice.choices[i][ChoicesManager.choiceIndeces[i]];
          console.debug('Decisions for reflection:', option);
          decisions += option + " ";
        }
        console.debug('Decisions for reflection:', decisions);
        
        // Call setUpAI to initialize the reflection with gemma
        const aiResponse = await setUpAI(scenario, decisions);
        
        // Create the initial dialogue node with AI response
        setCurrentDialogue({
          id: 'ai_initial',
          text: aiResponse,
          requiresInput: true,
          inputPrompt: 'Share your thoughts on this...',
          nextId: 'ai_response',
        });
      } catch (error) {
        console.error('Error initializing AI reflection:', error);
        setCurrentDialogue({
          id: 'error',
          text: 'I encountered an issue starting our reflection. Let\'s try thinking about your teaching choice anyway. What motivated your decision?',
          requiresInput: true,
          inputPrompt: 'Share your thoughts...',
          nextId: 'ai_response',
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeReflection();
  }, []);

  const handleAdvance = () => {
    if (!currentDialogue) return;

    // If thought bubbles are showing, dismiss them and show AI response
    if (showThoughtBubbles && canContinue) {
      setShowThoughtBubbles(false);
      
      if (pendingAIResponse) {
        const newCount = conversationCount;
        setCurrentDialogue({
          id: `ai_response_${newCount}`,
          text: pendingAIResponse,
          requiresInput: true,
          inputPrompt: 'Continue your reflection...',
          nextId: newCount + 1 >= maxConversations ? 'ending' : 'ai_response',
        });
        setPendingAIResponse(null);
      }
      return;
    }

    // If this dialogue requires input, wait for input instead of advancing
    if (currentDialogue.requiresInput && !isAwaitingInput) {
      setIsAwaitingInput(true);
      return;
    }

    // Check if we've reached the end of the reflection
    if (!currentDialogue.nextId || conversationCount >= maxConversations) {
      // End of dialogue
      setIsDialogueVisible(false);
      console.log('Reflection complete. User responses:', userResponses);
      return;
    }

    // If we have a nextId but it's the ending, show ending message
    if (currentDialogue.nextId === 'ending') {
      setCurrentDialogue({
        id: 'ending',
        text: 'Thank you for your reflections. Your insights have been recorded and will help you grow as an educator.',
      });
      setIsAwaitingInput(false);
    }
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

    // Save the sanitized input to the database
    try {
      await saveData(input);
      console.log('User response saved to database');
    } catch (error) {
      console.error('Error saving user response to database:', error);
    }

    // Show loading state while waiting for AI
    setIsLoading(true);
    setIsAwaitingInput(false);

    const newCount = conversationCount + 1;
    setConversationCount(newCount);

    // Check if we should end the reflection
    if (newCount >= maxConversations) {
      setCurrentDialogue({
        id: 'ending',
        text: 'Thank you for sharing your reflections. Your thoughtful insights show real growth as an educator. Keep questioning and learning!',
      });
      setIsLoading(false);
      return;
    }

    try {
      // Send user input to gemma and get response
      const aiResponse = await generateResponse(input);
      
      // Store the AI response and show thought bubbles first
      setPendingAIResponse(aiResponse);
      setIsLoading(false);
      setShowThoughtBubbles(true);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setPendingAIResponse('I appreciate your thoughts. Could you elaborate a bit more on that? What specific aspects of the classroom dynamic were you considering?');
      setIsLoading(false);
      setShowThoughtBubbles(true);
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
        {isLoading ? (
          <div className="flex flex-col z-10 justify-center items-center gap-4 w-[750px] max-w-[90vw] min-h-[120px] bg-gradient-to-br from-[var(--chart-3)]/95 via-[var(--chart-4)]/95 to-[var(--chart-5)]/95 border-2 border-border rounded-xl p-8">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-foreground font-medium">Thinking...</span>
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
