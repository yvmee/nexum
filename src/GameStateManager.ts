enum GameState {
  MENU,
  DIALOGUE,
  REFLECTION,
}

let currentState: GameState = GameState.DIALOGUE;

/**
 * GameStateManager - manages the current state of the game
 */
export const GameStateManager = {
  getState: (): GameState => currentState,
  setState: (newState: GameState): void => {
    currentState = newState;
}};