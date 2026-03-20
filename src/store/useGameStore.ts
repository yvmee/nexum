import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { DialogueNode } from '../storydata/dialogueData';
import { ReflectionNode } from '../storydata/reflectionData';
import {
  StoryFlow,
  evaluateNextChunk,
  chunkHasReflection,
} from '../storydata/storyFlow';
import { exampleStoryFlow } from '../storydata/storyFlowData';
import { backgrounds } from '../storydata/assetData';

// TODO: delete INTRO scene? just load intro dialogue as first chunk in STORY scene
type Scene = 'INTRO' | 'STORY' | 'REFLECTION' | 'MINIGAME' | 'END'; // All scenes with different layouts
type GameState = 'IDLE' | 'PLAYING' | 'PAUSED' | 'END' ; // Overall game state (for future use, e.g. pause menu)

interface GameManagerState {
  currentScene: Scene;
  startNodeId: string;
  currentBackground: string;
  currentDialogueId: string | null;
  currentReflectionNodeId: string | null;
  gameState: GameState;

  // Story flow state
  storyFlow: StoryFlow | null;
  currentChunkId: string | null;
  activeDialogues: DialogueNode[];
  activeReflectionNodes: ReflectionNode[];

  // Player Data for tracking choices and branching
  playerChoices: Record<string, string | boolean | number>;
  reflectionAnswers: Record<string, string>; // maybe not needed bc db

  // Actions to manage game flow
  startGame: () => void;
  setScene: (scene: Scene) => void;
  advanceDialogue: (nextDialogueId?: string) => void;
  advanceReflection: (nextReflectionNodeId?: string) => void;
  completeChunk: () => void;
  completeReflection: () => void;
  makeChoice: (variableId: string, value: string | boolean | number) => void;
  submitReflection: (promptId: string, answer: string) => void; 
}

// Hooks for derived state
export const useCurrentDialogue = () => useGameStore((state) => 
  state.activeDialogues.find((d) => d.id === state.currentDialogueId) || null
);

export const useCurrentReflection = () => useGameStore((state) => 
  state.activeReflectionNodes.find((n) => n.id === state.currentReflectionNodeId) || null
);

//  Helper: activate a chunk by loading its dialogue / reflection into state
function activateChunk(
  flow: StoryFlow,
  chunkId: string,
): Partial<GameManagerState> {
  const chunk = flow.chunks[chunkId];
  if (!chunk) {
    return { currentScene: 'END' as Scene };
  }
  const firstDialogueId = chunk.dialogueNodes[0]?.id ?? 'start';
  const firstBackground = chunk.dialogueNodes[0]?.background 
    ? backgrounds[chunk.dialogueNodes[0].background as keyof typeof backgrounds]
    : backgrounds.schoolBackground;
  const firstReflectionNodeId = chunk.reflectionNodes?.[0]?.id ?? null;
  console.debug(`Activating chunk with node id:`, firstDialogueId);
  return {
    currentChunkId: chunkId,
    activeDialogues: chunk.dialogueNodes,
    activeReflectionNodes: chunk.reflectionNodes ?? [],
    startNodeId: firstDialogueId,
    currentDialogueId: firstDialogueId,
    currentReflectionNodeId: firstReflectionNodeId,
    currentBackground: firstBackground,
    currentScene: 'STORY' as Scene,
  };
}

export const useGameStore = create<GameManagerState>()(persist((set, get) => ({
  currentScene: 'STORY',
  startNodeId: 'start',
  currentBackground: backgrounds.schoolBackground, // set by chunk or default to intro background
  currentDialogueId: null,
  currentReflectionNodeId: null,
  gameState: 'IDLE',

  // Story flow state
  storyFlow: exampleStoryFlow, // Load example flow by default for testing
  currentChunkId: null,
  activeDialogues: [],
  activeReflectionNodes: [],

  // Player data
  playerChoices: {},
  reflectionAnswers: {},

  // Start the game loop by activating the first chunk of the loaded story flow
  startGame: () => {
    const { storyFlow } = get();
    if (storyFlow) {
      // DEBUG
      console.log('Starting game with story flow:', storyFlow.id);
      set({
        currentScene: 'STORY',
        gameState: 'PLAYING',
        ...activateChunk(storyFlow, storyFlow.initialChunkId),
      });
    } else {
      set({ currentScene: 'STORY', startNodeId: 'start', gameState: 'PLAYING', currentBackground: backgrounds.schoolBackground });
    }
  },

  // Simple scene switcher for manual overrides
  setScene: (scene) => set({ currentScene: scene }),

  // Advance to the next dialogue node
  advanceDialogue: (nextDialogueId?: string) => {
    const { activeDialogues, currentDialogueId, completeChunk } = get();
    
    let targetId = nextDialogueId;
    if (!targetId && currentDialogueId) {
      const currentDialogue = activeDialogues.find((d) => d.id === currentDialogueId);
      targetId = currentDialogue?.nextId;
    }

    if (targetId) {
      const nextDialogue = activeDialogues.find((d) => d.id === targetId);
      if (nextDialogue) {
        if (nextDialogue.background) {
          const newBackground = backgrounds[nextDialogue.background as keyof typeof backgrounds];
          if (newBackground) {
            set({ currentBackground: newBackground });
          }
        }
        set({ currentDialogueId: targetId });
        return;
      }
    }

    // No next node or target found, complete the chunk
    console.log('Dialogue sequence completed!');
    completeChunk();
  },

  // Advance to the next reflection node
  advanceReflection: (nextReflectionNodeId?: string) => {
    const { activeReflectionNodes, currentReflectionNodeId, completeReflection } = get();

    let targetId = nextReflectionNodeId;
    if (!targetId && currentReflectionNodeId) {
      const currentReflection = activeReflectionNodes.find((n) => n.id === currentReflectionNodeId);
      targetId = currentReflection?.nextId;
    }

    if (targetId) {
      const nextReflection = activeReflectionNodes.find((n) => n.id === targetId);
      if (nextReflection) {
        set({ currentReflectionNodeId: targetId });
        return;
      }
    }

    console.log('Reflection sequence completed!');
    completeReflection();
  },

  // Save player choice for branching and move the story
  makeChoice: (variableId, value) => set((state) => {
    console.log('Choice made:', { variableId, value });
    return {
      playerChoices: {
        ...state.playerChoices,
        [variableId]: value,
      },
    };
  }),

  // Save reflection and transition back to dialogue
  submitReflection: (promptId, answer) => set((state) => ({
    reflectionAnswers: {
      ...state.reflectionAnswers,
      [promptId]: answer,
    }
  })),

  completeChunk: () => {
    const { storyFlow, currentChunkId } = get();
    if (!storyFlow || !currentChunkId) return;

    // Check if this chunk has a reflection scene
    if (chunkHasReflection(storyFlow, currentChunkId)) {
      const chunk = storyFlow.chunks[currentChunkId];
      set({
        currentScene: 'REFLECTION',
        activeReflectionNodes: chunk?.reflectionNodes ?? [],
        currentReflectionNodeId: chunk?.reflectionNodes?.[0]?.id ?? null,
        startNodeId: chunk?.reflectionNodes?.[0]?.id ?? 'start',
      });
      return;
    }

    // No reflection, go straight to next chunk
    const { playerChoices } = get();
    const nextChunkId = evaluateNextChunk(storyFlow, currentChunkId, playerChoices);
    if (nextChunkId) {
      set(activateChunk(storyFlow, nextChunkId));
    } else {
      set({ currentScene: 'END' });
      set({ gameState: 'END' });
    }
  },

  completeReflection: () => {
    const { storyFlow, currentChunkId, playerChoices } = get();
    if (!storyFlow || !currentChunkId) return;

    console.log('Reflection completed. Evaluating next chunk');
    const nextChunkId = evaluateNextChunk(storyFlow, currentChunkId, playerChoices);
    if (nextChunkId) {
      set(activateChunk(storyFlow, nextChunkId));
    } else {
      set({ currentScene: 'END' });
      set({ gameState: 'END' });
    }
  },
}), { // persist gameStore so refreshing doesn't lose progress
  name: 'nexum-game-store',
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({
    currentScene: state.currentScene,
    startNodeId: state.startNodeId,
    currentBackground: state.currentBackground,
    currentDialogueId: state.currentDialogueId,
    currentReflectionNodeId: state.currentReflectionNodeId,
    gameState: state.gameState,
    currentChunkId: state.currentChunkId,
    activeDialogues: state.activeDialogues,
    activeReflectionNodes: state.activeReflectionNodes,
    playerChoices: state.playerChoices,
    reflectionAnswers: state.reflectionAnswers,
  }),
}));