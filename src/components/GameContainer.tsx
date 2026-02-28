import { useSceneStore } from '../store/useSceneStore';
import { Intro } from '../scenes/intro/IntroLayout';
import { LayoutDialogue } from '../scenes/dialogue/LayoutDialogue';
import { ReflectionDialogue } from '../scenes/reflection/ReflectionDialogue';

/** 
 * Page that contains the entire game and renders different game scenes based on the SceneStore.
 */
export default function GameContainer() {
  const currentScene = useSceneStore((state) => state.currentScene);

  return (
    <div className="w-full h-screen bg-gray-900">
      {currentScene === 'INTRO' && <Intro />}
      {currentScene === 'STORY' && <LayoutDialogue />}
      {currentScene === 'REFLECTION' && <ReflectionDialogue />}
    </div>
  );
}