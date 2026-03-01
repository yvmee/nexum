import { create } from 'zustand';

type Scene = 'INTRO' | 'STORY' | 'REFLECTION'; // All scenes with different layouts

interface SceneState {
  currentScene: Scene;
  setScene: (scene: Scene) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  currentScene: 'INTRO', // Default starting scene
  setScene: (scene) => set({ currentScene: scene }),
}));