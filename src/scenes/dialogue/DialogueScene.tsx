import React, { useEffect } from 'react';
import { DialogueBox } from './DialogueBox.tsx';
import { CutsceneManager } from '../../components/cutscenes/CutsceneManager.tsx';
import { MinigameManager } from '../../components/minigames/MinigameManager.tsx';
import { useGameStore, useCurrentDialogue } from '../../store/useGameStore.ts';
import { characters, characterRenderClasses } from '../../storydata/assetData.ts';
import { PipImage } from '../../components/PipImage.tsx';
import { useSoundStore } from '../../store/useSoundStore.ts';

/**
 * Dialogue scene that handles dialogue flow with branching support
 */
export const DialogueScene: React.FC = () => {

  const currentBackground = useGameStore((state) => state.currentBackground);
  const advanceDialogue = useGameStore((state) => state.advanceDialogue);
  const makeChoice = useGameStore((state) => state.makeChoice);
  const sortingGameChoices = useGameStore((state) => state.sortingGameChoices);

  const currentDialogue = useCurrentDialogue();
  const playBgm = useSoundStore((s) => s.playBgm);
  const stopBgm = useSoundStore((s) => s.stopBgm);
  const playSfx = useSoundStore((s) => s.playSfx);

  // Play dialogue BGM on mount
  useEffect(() => {
    playBgm('dialogueMusic');
  }, [playBgm]);

  // Data-driven SFX and mid-dialogue BGM changes
  useEffect(() => {
    if (currentDialogue?.sfx) playSfx(currentDialogue.sfx);
    if (currentDialogue?.bgm === '') {
      stopBgm();
    } else if (currentDialogue?.bgm) {
      playBgm(currentDialogue.bgm);
    }
  }, [currentDialogue?.sfx, currentDialogue?.bgm, playSfx, playBgm, stopBgm]);

  const nodeType = currentDialogue?.type || 'dialogue'; 
  const isCutsceneActive = currentDialogue !== null && nodeType === 'cutscene';
  const isMinigameActive = currentDialogue !== null && nodeType === 'minigame';
  const isDialogueActive = currentDialogue !== null && nodeType === 'dialogue';

  const leftPortrait = currentDialogue?.characterLeft
    ? characters[currentDialogue.characterLeft as keyof typeof characters]
    : undefined;
  const rightPortrait = currentDialogue?.characterRight
    ? characters[currentDialogue.characterRight as keyof typeof characters]
    : undefined;

  // Common styles for portraits with drop shadow, mirrored for right portrait
  const portraitImageClass = 'h-(--portrait-size) w-auto object-contain';
  const dropShadowFilter = 'drop-shadow(0 0 14px rgba(0, 0, 0, 0.45)) drop-shadow(0 16px 22px rgba(0, 0, 0, 0.55))';
  const portraitImageStyle: React.CSSProperties = {filter: dropShadowFilter};
  const mirroredPortraitStyle: React.CSSProperties = {...portraitImageStyle, transform: 'scaleX(-1)'};

  const isPipLeft = currentDialogue?.characterLeft === 'pip';
  const isPipRight = currentDialogue?.characterRight === 'pip';

  const leftPortraitClass = `${portraitImageClass} ${currentDialogue?.characterLeft ? characterRenderClasses[currentDialogue.characterLeft as keyof typeof characters] ?? '' : ''}`;
  const rightPortraitClass = `${portraitImageClass} ${currentDialogue?.characterRight ? characterRenderClasses[currentDialogue.characterRight as keyof typeof characters] ?? '' : ''}`;

  useEffect(() => {
    if (currentDialogue?.type === 'branching' && currentDialogue.branchConditions) {
      const match = currentDialogue.branchConditions.find(b => b.condition(sortingGameChoices));
      if (match) advanceDialogue(match.nextId);
    }
  }, [currentDialogue, sortingGameChoices]);

  // Advance to the next dialogue for non-branching nodes
  const handleAdvance = (): void => {
    advanceDialogue();
  };

  // Handle player selecting a dialogue option for dialogue branching
  const handleSelectOption = (nextId: string, choice?: Record<string, string | boolean | number>): void => {
    if (choice) { // Save the selected choice in game manager for chunk branching
      makeChoice(Object.keys(choice)[0], Object.values(choice)[0]);
    }

    advanceDialogue(nextId);
  };

  return (
    <div className="w-full h-full">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <img 
          src={currentBackground} 
          alt="Background" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Cutscene Layer */}
      {isCutsceneActive && (
        <div className="absolute inset-0 z-10 pointer-events-auto">
          <CutsceneManager 
            node={currentDialogue} 
            onComplete={handleAdvance} 
          />
        </div>
      )}

      {/* Minigame Layer */}
      {isMinigameActive && (
        <div className="absolute inset-0 z-10 pointer-events-auto bg-black/80">
          <MinigameManager node={currentDialogue} onComplete={handleAdvance} />
        </div>
      )}

      {/* Blur overlay on background*/}
      {isDialogueActive && (
        <div className="absolute inset-0 z-5 bg-black/15 backdrop-blur-[1px] pointer-events-none" />
      )}

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-center justify-between w-full h-full p-8 pointer-events-none">
        <div className="flex flex-col items-center justify-center mt-20"></div>
        {/* Dialogue Box Area */}
        <div className="pointer-events-auto mb-10 flex flex-col items-center w-full">
          {/* Optional Speaker Portraits */}
          {isDialogueActive && (leftPortrait || rightPortrait) && (
            <div className="w-(--box-width) max-w-[90vw] -mb-2 px-2 flex items-end justify-between">
              <div className="min-h-(--portrait-size) flex items-end">
                {leftPortrait && (
                  isPipLeft ? (
                    <PipImage
                      alt={`${currentDialogue?.speaker ?? 'Character'} portrait`}
                      className={leftPortraitClass}
                      extraFilter={dropShadowFilter}
                    />
                  ) : (
                    <img
                      src={leftPortrait}
                      alt={`${currentDialogue?.speaker ?? 'Character'} portrait`}
                      className={leftPortraitClass}
                      style={portraitImageStyle}
                    />
                  )
                )}
              </div>
              <div className="min-h-(--portrait-size) flex items-end justify-end">
                {rightPortrait && (
                  isPipRight ? (
                    <PipImage
                      alt={`${currentDialogue?.speaker ?? 'Character'} portrait`}
                      className={rightPortraitClass}
                      extraFilter={dropShadowFilter}
                      style={{ transform: 'scaleX(-1)' }}
                    />
                  ) : (
                    <img
                      src={rightPortrait}
                      alt={`${currentDialogue?.speaker ?? 'Character'} portrait`}
                      className={rightPortraitClass}
                      style={mirroredPortraitStyle}
                    />
                  )
                )}
              </div>
            </div>
          )}
          <DialogueBox
            dialogue={currentDialogue}
            onAdvance={handleAdvance}
            onSelectOption={handleSelectOption}
            isVisible={isDialogueActive}
          />
        </div>
      </div>
    </div>
  );
};
