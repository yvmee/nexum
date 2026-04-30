import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { DialogueScene } from '../scenes/dialogue/DialogueScene';
import { ReflectionScene } from '../scenes/reflection/ReflectionScene';
import { SettingsMenu } from '../components/SettingsMenu';

/** 
 * Page that contains the entire game and renders different game scenes based on the SceneStore.
 */
export default function GameContainer() {
  const navigate = useNavigate();
  const currentScene = useGameStore((state) => state.currentScene);
  const gameState = useGameStore((state) => state.gameState);

  useEffect(() => {
    if (gameState === 'END') {
      void navigate('/evaluation');
    }
  }, [gameState, navigate]);

  return (
    <div className="w-full h-screen bg-gray-900">
      <SettingsMenu />
      {currentScene === 'STORY' && <DialogueScene />}
      {currentScene === 'REFLECTION' && <ReflectionScene />}
    </div>
  );
}