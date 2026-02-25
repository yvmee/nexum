import { create } from 'zustand';

type Scene = 'INTRO' | 'STORY' | 'REFLECTION'; // All scenes with different layouts

interface GameState {
  currentScene: Scene;
  setScene: (scene: Scene) => void;
}

export const useSceneStore = create<GameState>((set) => ({
  currentScene: 'INTRO', // Default starting scene
  setScene: (scene) => set({ currentScene: scene }),
}));