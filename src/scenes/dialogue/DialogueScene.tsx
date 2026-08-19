import React, { useEffect, useRef, useState } from 'react';
import * as motion from "motion/react-client";
import { DialogueBox } from './DialogueBox.tsx';
import { CutsceneManager } from '../../components/cutscenes/CutsceneManager.tsx';
import { MinigameManager } from '../../components/minigames/MinigameManager.tsx';
import { useGameStore, useCurrentDialogue } from '../../store/useGameStore.ts';
import { characters, characterRenderClasses } from '../../storydata/assetData.ts';
import { PipImage } from '../../components/PipImage.tsx';
import { isDialogueNode, isCutsceneNode, isMinigameNode, isBranchingNode } from '../../storydata/dialogueData.ts';

/**
 * Dialogue scene that handles dialogue flow with branching support
 */
export const DialogueScene: React.FC = () => {

  const currentBackground = useGameStore((state) => state.currentBackground);
  const advanceDialogue = useGameStore((state) => state.advanceDialogue);
  const goBackDialogue = useGameStore((state) => state.goBackDialogue);
  const dialogueHistory = useGameStore((state) => state.dialogueHistory);
  const makeChoice = useGameStore((state) => state.makeChoice);
  const playerChoices = useGameStore((state) => state.playerChoices);
  const openPathSelection = useGameStore((state) => state.openPathSelection);

  const currentDialogue = useCurrentDialogue();

  const dialogueNode = currentDialogue && isDialogueNode(currentDialogue) ? currentDialogue : null;
  const cutsceneNode = currentDialogue && isCutsceneNode(currentDialogue) ? currentDialogue : null;
  const minigameNode = currentDialogue && isMinigameNode(currentDialogue) ? currentDialogue : null;
  const branchingNode = currentDialogue && isBranchingNode(currentDialogue) ? currentDialogue : null;

  const isDialogueActive = dialogueNode !== null;

  const leftPortrait = dialogueNode?.characterLeft
    ? characters[dialogueNode.characterLeft as keyof typeof characters]
    : undefined;
  const rightPortrait = dialogueNode?.characterRight
    ? characters[dialogueNode.characterRight as keyof typeof characters]
    : undefined;

  // Common styles for portraits with drop shadow, mirrored for right portrait
  const portraitImageClass = 'h-(--portrait-size) w-auto object-contain';
  const dropShadowFilter = 'drop-shadow(0 0 14px rgba(0, 0, 0, 0.45)) drop-shadow(0 16px 22px rgba(0, 0, 0, 0.55))';
  const isPipLeft = dialogueNode?.characterLeft === 'pip';
  const isPipRight = dialogueNode?.characterRight === 'pip';

  // Determine which side is the active speaker for portrait dimming
  const activeSide = (() => {
    if (!dialogueNode) return 'both'; // no dialogue
    if (dialogueNode.activeSide) return dialogueNode.activeSide; // explicit override
    if (!dialogueNode.speaker || dialogueNode.speaker === 'Narrator') return 'none';
    // Infer active side based on speaker
    const speakerKey = dialogueNode.speaker.toLowerCase();
    const leftActive = dialogueNode.characterLeft?.toLowerCase().startsWith(speakerKey);
    const rightActive = dialogueNode.characterRight?.toLowerCase().startsWith(speakerKey);
    if (leftActive) return 'left';
    if (rightActive) return 'right';
    return 'both';
  })();

  // Apply dimming filter
  const inactiveFilter = 'grayscale(35%) brightness(0.7)';
  const leftPortraitFilter = (activeSide === 'right' || activeSide === 'none') ? `${inactiveFilter} ${dropShadowFilter}` : dropShadowFilter;
  const rightPortraitFilter = (activeSide === 'left' || activeSide === 'none') ? `${inactiveFilter} ${dropShadowFilter}` : dropShadowFilter;
  const leftPortraitClass = `${portraitImageClass} transition-[filter] duration-300 ${dialogueNode?.characterLeft ? characterRenderClasses[dialogueNode.characterLeft as keyof typeof characters] ?? '' : ''}`;
  const rightPortraitClass = `${portraitImageClass} transition-[filter] duration-300 ${dialogueNode?.characterRight ? characterRenderClasses[dialogueNode.characterRight as keyof typeof characters] ?? '' : ''}`;

  // Background animation state
  const [displayedBackground, setDisplayedBackground] = useState(currentBackground);
  const [transitionPhase, setTransitionPhase] = useState<'idle' | 'cover' | 'reveal'>('idle');
  const pendingBg = useRef<string>('');

  useEffect(() => {
    if (currentBackground !== displayedBackground && transitionPhase === 'idle') {
      pendingBg.current = currentBackground;
      setTransitionPhase('cover');
    }
  }, [currentBackground, displayedBackground, transitionPhase]);

  useEffect(() => {
    if (branchingNode) {
      const match = branchingNode.branchConditions.find(b => b.condition(playerChoices));
      if (match) {
        advanceDialogue(match.nextId);
      }
    }
  }, [branchingNode, playerChoices]);

  useEffect(() => {
    if (dialogueNode?.triggersPathSelection) {
      openPathSelection();
    }
  }, [dialogueNode?.id]);

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
    <div className="w-full h-full bg-black">
      {/* Background Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${displayedBackground})` }}
      />

      {/* Background Transition Overlay */}
      {transitionPhase !== 'idle' && (
        <motion.div
          className="absolute inset-0 z-50 bg-black"
          initial={{ x: transitionPhase === 'cover' ? '-100%' : '0%' }}
          animate={{ x: transitionPhase === 'cover' ? '0%' : '100%' }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          onAnimationComplete={() => {
            if (transitionPhase === 'cover') {
              setDisplayedBackground(pendingBg.current);
              setTransitionPhase('reveal');
            } else {
              setTransitionPhase('idle');
            }
          }}
        />
      )}

      {/* Cutscene Layer */}
      {cutsceneNode && (
        <div className="absolute inset-0 z-10 pointer-events-auto">
          <CutsceneManager
            node={cutsceneNode}
            onComplete={handleAdvance}
          />
        </div>
      )}

      {/* Minigame Layer */}
      {minigameNode && (
        <div className="absolute inset-0 z-10 pointer-events-auto bg-black/80">
          <MinigameManager node={minigameNode} onComplete={handleAdvance} />
        </div>
      )}

      {/* Blur overlay on background*/}
      {isDialogueActive && (
        <div className="absolute inset-0 z-5 bg-black/15 backdrop-blur-[1px] pointer-events-none" />
      )}

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-center justify-end w-full h-full pointer-events-none">
        {/* Centered container matching dialogue box width with portraits as absolute children */}
        <div className="relative pointer-events-auto mb-10 w-(--box-width) max-w-[90vw]">

          {/* Dialogue Box */}
          <div className="relative z-10">
            <DialogueBox
              dialogue={dialogueNode}
              onAdvance={handleAdvance}
              onSelectOption={handleSelectOption}
              onGoBack={goBackDialogue}
              canGoBack={dialogueHistory.length > 0 && !currentDialogue?.location}
              isVisible={isDialogueActive && transitionPhase === 'idle'}
            />
          </div>

          {/* Left Portrait (attached to left edge of the dialogue box) */}
          {isDialogueActive && transitionPhase === 'idle' && leftPortrait && (
            <div
              className="absolute bottom-0 left-0 z-20 pointer-events-none"
              style={{ transform: 'translateX(-70%) translateY(-7rem)' }}
            >
              <div className="relative">
                {isPipLeft ? (
                  <>
                    <PipImage
                      alt={`${dialogueNode?.speaker ?? 'Character'} portrait`}
                      className={leftPortraitClass}
                      extraFilter={leftPortraitFilter}
                    />
                    <div className="absolute inset-x-30 bottom-0 h-1/5 bg-linear-to-t from-primary/40 to-transparent pointer-events-none rounded-b-3xl" />
                  </>
                ) : (
                  <>
                    <img
                      src={leftPortrait}
                      alt={`${dialogueNode?.speaker ?? 'Character'} portrait`}
                      className={leftPortraitClass}
                      style={{ filter: leftPortraitFilter }}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/5 bg-linear-to-t from-primary/40 to-transparent pointer-events-none rounded-b-3xl" />
                  </>
                )}
              </div>
            </div>
          )}

          {/* Right Portrait (attached to right edge of the dialogue box) */}
          {isDialogueActive && transitionPhase === 'idle' && rightPortrait && (
            <div
              className="absolute bottom-0 right-0 z-20 pointer-events-none"
              style={{ transform: 'translateX(70%) translateY(-7rem)' }}
            >
              <div className="relative">
                {isPipRight ? (
                  <>
                    <PipImage
                      alt={`${dialogueNode?.speaker ?? 'Character'} portrait`}
                      className={rightPortraitClass}
                      extraFilter={rightPortraitFilter}
                      style={{ transform: 'scaleX(-1)' }}
                    />
                    <div className="absolute inset-x-30 bottom-0 h-1/5 bg-linear-to-t from-primary/40 to-transparent pointer-events-none rounded-b-3xl" />
                  </>
                ) : (
                  <>
                    <img
                      src={rightPortrait}
                      alt={`${dialogueNode?.speaker ?? 'Character'} portrait`}
                      className={rightPortraitClass}
                      style={{ filter: rightPortraitFilter, transform: 'scaleX(-1)' }}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/5 bg-linear-to-t from-primary/40 to-transparent pointer-events-none rounded-b-3xl" />
                  </>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};