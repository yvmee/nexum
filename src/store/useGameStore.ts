import { create } from 'zustand';
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
type GameState = 'IDLE' | 'PLAYING' | 'PAUSED' ; // Overall game state (for future use, e.g. pause menu)

interface GameManagerState {
  currentScene: Scene;
  startNodeId: string;
  currentBackground: string;
  gameState: GameState;

  // ── Story flow state ──
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
  //advanceStory: (nextNodeId: string, newBackground?: string) => void; // maybe not needed, advance in chunks
  completeChunk: () => void;
  completeReflection: () => void;
  makeChoice: (variableId: string, value: string | boolean | number, nextNodeId: string) => void;
  submitReflection: (promptId: string, answer: string) => void; 
}

// ── Helper: activate a chunk by loading its dialogue / reflection into state ──
function activateChunk(
  flow: StoryFlow,
  chunkId: string,
): Partial<GameManagerState> {
  const chunk = flow.chunks[chunkId];
  if (!chunk) {
    return { currentScene: 'END' as Scene };
  }
  console.debug(`Activating chunk with node id:`, chunk.dialogueNodes[0]?.id);
  return {
    currentChunkId: chunkId,
    activeDialogues: chunk.dialogueNodes,
    activeReflectionNodes: chunk.reflectionNodes ?? [],
    startNodeId: chunk.dialogueNodes[0]?.id ?? 'start',
    currentScene: 'STORY' as Scene,
  };
}

export const useGameStore = create<GameManagerState>((set, get) => ({
  currentScene: 'STORY',
  startNodeId: 'start',
  currentBackground: backgrounds.schoolBackground, // set by chunk or default to intro background
  gameState: 'IDLE',

  // Story flow state
  storyFlow: exampleStoryFlow, // Load example flow by default for testing
  currentChunkId: null,
  activeDialogues: [],
  activeReflectionNodes: [],

  // Player data
  playerChoices: {},
  reflectionAnswers: {},

  // Start the game loop – activates the first chunk of the loaded story flow
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

  // Moves the story forward (Next button)
  // advanceStory: (nextNodeId, newBackground) => set((state) => ({
  //   startNodeId: nextNodeId,
  //   // Keep current background if a new one isn't provided
  //   currentBackground: newBackground || state.currentBackground,
  // })),

  // Save player choice for branching and move the story
  makeChoice: (variableId, value, nextNodeId) => set((state) => {
    console.log('Choice made:', { variableId, value, nextNodeId });
    return {
      playerChoices: {
        ...state.playerChoices,
        [variableId]: value,
      },
      //startNodeId: nextNodeId,
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
        startNodeId: chunk?.reflectionNodes?.[0]?.id ?? 'start',
      });
      return;
    }

    // No reflection, go straight to next chunk
    const { playerChoices, currentBackground } = get();
    const nextChunkId = evaluateNextChunk(storyFlow, currentChunkId, playerChoices);
    if (nextChunkId) {
      set(activateChunk(storyFlow, nextChunkId));
    } else {
      set({ currentScene: 'END' });
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
    }
  },
}));