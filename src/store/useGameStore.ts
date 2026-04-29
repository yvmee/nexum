import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { SceneNode } from '../storydata/dialogueData';
import { locations } from '../storydata/dialogueData';
import { ReflectionNode } from '../storydata/reflectionData';
import {
  StoryFlow,
  evaluateNextChunk,
  chunkHasReflection,
} from '../storydata/storyFlow';
import { gameFlow, testFlow } from '../storydata/storyFlowData';
import { backgrounds } from '../storydata/assetData';
import { scoreInput } from '../lib/scoreInput';
import { isBgmTrack, isSfxTrack, useSoundStore } from './useSoundStore';

type Scene = 'STORY' | 'REFLECTION' | 'END'; // All scenes with different layouts
type GameState = 'IDLE' | 'PLAYING' | 'PAUSED' | 'END' ; // Overall game state (for future use, e.g. pause menu)

const backupBackground = backgrounds.hallway; // Fallback background 

function applyDialogueAudio(dialogueNode: SceneNode | undefined): void {
  if (!dialogueNode) return;

  const { playSfx, playBgm, stopBgm } = useSoundStore.getState();

  if (isSfxTrack(dialogueNode.sfx)) {
    playSfx(dialogueNode.sfx);
  }

  if (!dialogueNode.location) return;

  const locationData = locations[dialogueNode.location];
  if (!locationData) return;

  if (locationData.bgm === '') {
    stopBgm();
    return;
  }

  if (isBgmTrack(locationData.bgm)) {
    playBgm(locationData.bgm);
  }
}

interface GameManagerState {
  currentScene: Scene;
  startNodeId: string;
  currentBackground: string;
  currentDialogueId: string | null;
  currentReflectionNodeId: string | null;
  gameState: GameState;

  // Pip color value: 0 = fully grey, 100 = fully colorful
  pipColorValue: number;
  reflectionInputScores: number[]; // scores for current reflection section

  // Story flow state
  storyFlow: StoryFlow | null;
  currentChunkId: string | null;
  activeDialogues: SceneNode[];
  activeReflectionNodes: ReflectionNode[];
  session: number; // for db

  // Player Data for tracking choices and branching
  playerChoices: Record<string, string | boolean | number>;
  reflectionAnswers: Record<string, string>; // maybe not needed bc db
  // for sorting minigame, seperated from playerChoices for easier handling
  sortingGameChoices: number[];

  // Dialogue IDs history for going back 
  dialogueHistory: string[];
  historyLength: number;

  // Actions to manage game flow
  startGame: () => void;
  setScene: (scene: Scene) => void;
  advanceDialogue: (nextDialogueId?: string) => void;
  goBackDialogue: () => void;
  advanceReflection: (nextReflectionNodeId?: string) => void;
  completeChunk: () => void;
  completeReflection: () => void;
  makeChoice: (variableId: string, value: string | boolean | number) => void;
  submitReflection: (promptId: string, answer: string) => void;
  evaluateReflectionInput: (input: string) => number;
  submitSortingGame: (ids: number[]) => void;
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
  const firstNode = chunk.dialogueNodes[0];
  const firstLocationKey = firstNode?.location;
  const firstLocationData = firstLocationKey ? locations[firstLocationKey] : undefined;
  const firstBackground = firstLocationData
    ? backgrounds[firstLocationData.background as keyof typeof backgrounds] ?? backupBackground
    : backupBackground;
  const firstReflectionNodeId = chunk.reflectionNodes?.[0]?.id ?? null;
  applyDialogueAudio(firstNode);
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
    dialogueHistory: [],
  };
}

export const useGameStore = create<GameManagerState>()(persist((set, get) => ({
  currentScene: 'STORY' as Scene,
  startNodeId: 'start',
  currentBackground: backupBackground, // set by chunk or default to intro background
  currentDialogueId: null,
  currentReflectionNodeId: null,
  gameState: 'PLAYING',

  // Pip color
  pipColorValue: 0,
  reflectionInputScores: [],

  // Story flow state
  storyFlow: testFlow,
  currentChunkId: null,
  activeDialogues: [],
  activeReflectionNodes: [],
  session: 0,

  // Dialogue history
  dialogueHistory: [],
  historyLength: 5, 

  // Player data
  playerChoices: {},
  reflectionAnswers: {},
  sortingGameChoices: [],

  // Start the game loop by activating the first chunk of the loaded story flow
  startGame: () => {
    const { storyFlow } = get();
    if (storyFlow) {

      console.log('Starting game with story flow:', storyFlow.id);
      set({
        currentScene: 'STORY',
        gameState: 'PLAYING',
        pipColorValue: 20,
        reflectionInputScores: [],
        playerChoices: {},
        reflectionAnswers: {},
        sortingGameChoices: [],
        dialogueHistory: [],
        ...activateChunk(storyFlow, storyFlow.initialChunkId),
      });
    } else {
      console.error('No story flow found to start the game!');
      set({ currentScene: 'STORY', startNodeId: 'start', gameState: 'PLAYING' });
    }

    console.log('Game started. Current pip color value:', get().pipColorValue);
  },

  // Simple scene switcher for manual overrides
  setScene: (scene) => set({ currentScene: scene }),

  // Advance to the next dialogue node
  advanceDialogue: (nextDialogueId?: string) => {
    const { activeDialogues, currentDialogueId, completeChunk, dialogueHistory, historyLength } = get();
    
    let targetId = nextDialogueId;
    if (!targetId && currentDialogueId) {
      const currentDialogue = activeDialogues.find((d) => d.id === currentDialogueId);
      targetId = currentDialogue?.nextId;
    }

    if (targetId) {
      const nextDialogue = activeDialogues.find((d) => d.id === targetId);
      if (nextDialogue) {
        if (nextDialogue.location) {
          const locationData = locations[nextDialogue.location];
          if (locationData) {
            const newBackground = backgrounds[locationData.background as keyof typeof backgrounds];
            if (newBackground) {
              set({ currentBackground: newBackground });
            }
          }
        }
        applyDialogueAudio(nextDialogue);
        // Push current ID to history 
        const newHistory = currentDialogueId
          ? [...dialogueHistory, currentDialogueId].slice(-historyLength)
          : dialogueHistory;
        set({ currentDialogueId: targetId, dialogueHistory: newHistory });
        return;
      }
    }

    // No next node or target found, complete the chunk
    console.log('Dialogue sequence completed!');
    completeChunk();
  },

  // Go back to the previous dialogue node
  goBackDialogue: () => {
    const { dialogueHistory, activeDialogues } = get();
    if (dialogueHistory.length === 0) return;

    const previousId = dialogueHistory[dialogueHistory.length - 1];
    const previousDialogue = activeDialogues.find((d) => d.id === previousId);
    if (!previousDialogue) return;

    const newHistory = dialogueHistory.slice(0, -1);
    if (previousDialogue.location) {
      const locationData = locations[previousDialogue.location];
      if (locationData) {
        const newBackground = backgrounds[locationData.background as keyof typeof backgrounds];
        if (newBackground) {
          set({ currentBackground: newBackground });
        }
      }
    }
    applyDialogueAudio(previousDialogue);
    set({ currentDialogueId: previousId, dialogueHistory: newHistory });
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

  // Evaluate a reflection input and return its score
  evaluateReflectionInput: (input: string) => {
    const score = scoreInput(input);
    set((state) => ({
      reflectionInputScores: [...state.reflectionInputScores, score],
    }));
    return score;
  },

  // Save sorting minigame choices to playerChoices
  submitSortingGame: (ids: number[]) => set((state) => {
    console.log('sorted ids:', { ids });
    return {
      sortingGameChoices: ids,
      playerChoices: {
        ...state.playerChoices,
        sortingGameChoices: ids.join(','), 
      },
    };
  }),

  completeChunk: () => {
    const { storyFlow, currentChunkId, pipColorValue } = get();
    if (!storyFlow || !currentChunkId) return;

    // Check if this chunk has a reflection scene
    if (chunkHasReflection(storyFlow, currentChunkId)) {
      const chunk = storyFlow.chunks[currentChunkId];
      useSoundStore.getState().playBgm('reflectionMusic');
      set({
        currentScene: 'REFLECTION',
        session: chunk.reflectionSessionNumber ?? 0,
        activeReflectionNodes: chunk?.reflectionNodes ?? [],
        currentReflectionNodeId: chunk?.reflectionNodes?.[0]?.id ?? null,
        startNodeId: chunk?.reflectionNodes?.[0]?.id ?? 'start',
      });
      return;
    }

    // No reflection, go straight to next chunk
    const { playerChoices } = get();
    const nextChunkId = evaluateNextChunk(storyFlow, currentChunkId, playerChoices, pipColorValue);
    if (nextChunkId) {
      set(activateChunk(storyFlow, nextChunkId));
    } else {
      set({ currentScene: 'END' });
      set({ gameState: 'END' });
    }
  },

  completeReflection: () => {
    const { storyFlow, currentChunkId, playerChoices, reflectionInputScores, pipColorValue } = get();
    if (!storyFlow || !currentChunkId) return;

    // Calculate color increase from this reflection section
    if (reflectionInputScores.length > 0) {
      const totalScore = reflectionInputScores.reduce((sum, s) => sum + s, 0);
      const maxPossible = reflectionInputScores.length * 5;
      const scoreRatio = totalScore / maxPossible; // 0 to 1
      const colorIncrease = Math.round(scoreRatio * 33); // Up to +33 per reflection because there are currently only 3 reflections
      const newColorValue = Math.min(pipColorValue + colorIncrease, 100);
      console.log(`Reflection score: ${totalScore}/${maxPossible} (${Math.round(scoreRatio * 100)}%). Color: ${pipColorValue} -> ${newColorValue}`);
      set({ pipColorValue: newColorValue, reflectionInputScores: [] });
    }

    console.log('Reflection completed. Evaluating next chunk');
    const nextChunkId = evaluateNextChunk(storyFlow, currentChunkId, playerChoices, pipColorValue);
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
    // activeDialogues excluded since it contains functions that can't be serialized
    // activeReflectionNodes excluded for same reason
    playerChoices: state.playerChoices,
    reflectionAnswers: state.reflectionAnswers,
    pipColorValue: state.pipColorValue,
    sortingGameChoices: state.sortingGameChoices,
    dialogueHistory: state.dialogueHistory,
  }),
  onRehydrateStorage: () => (state) => {
    if (!state?.currentChunkId) return;
    const flow = state.storyFlow ?? gameFlow;
    const chunk = flow?.chunks[state.currentChunkId];
    if (chunk) {
      state.activeDialogues = chunk.dialogueNodes;
      state.activeReflectionNodes = chunk.reflectionNodes ?? [];
      state.storyFlow = flow;
      const activeDialogue = chunk.dialogueNodes.find((d) => d.id === state.currentDialogueId);
      applyDialogueAudio(activeDialogue);
    }
  },
}));