import React from 'react';
import { SceneNode } from '../../storydata/dialogueData.ts';
import { withClickSound } from '../../store/useSoundStore.ts';

type DialogueBoxProps = {
  dialogue: SceneNode | null;
  onAdvance: () => void;
  onSelectOption: (nextId: string, choice?: Record<string, string | boolean | number>) => void;
  onGoBack?: () => void;
  canGoBack?: boolean;
  isVisible: boolean;
};

/**
 * React component for displaying dialogue text with optional branching choices
 */
export const DialogueBox: React.FC<DialogueBoxProps> = ({
  dialogue,
  onAdvance,
  onSelectOption,
  onGoBack,
  canGoBack = true,
  isVisible,
}) => {
  if (!isVisible || !dialogue) {
    return null;
  }

  const hasOptions = dialogue.options && dialogue.options.length > 0;
  const isInnerMonologue = dialogue.speaker === 'Mayra (in)'
    && typeof dialogue.text === 'string';
  const speakerLabel = isInnerMonologue ? 'Mayra' : dialogue.speaker;

  return (
    <div
      className={`flex flex-col z-10 justify-between gap-(--box-gap) w-(--box-width) max-w-[90vw] min-h-(--box-min-height) bg-linear-to-br from-(--chart-3)/95 via-(--chart-4)/95 to-(--chart-5)/95 border-2 border-border rounded-xl p-(--box-padding) select-none transition-all duration-100 ${
        !hasOptions ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20' : ''
      }`}
      onClick={!hasOptions ? withClickSound(onAdvance) : undefined}
    >
      {/* Speaker Name (hide for Narrator and change for Mayra (in)) */}
      {dialogue.speaker && dialogue.speaker !== 'Narrator' && (
        <div className="flex text-primary font-semibold">
          {speakerLabel}
        </div>
      )}
      {/* Dialogue Text (italic for Narrator / inner monologue) */}
      <div className={`flex text-(--text-body) leading-relaxed px-(--inner-px) font-medium ${dialogue.speaker === 'Narrator' || isInnerMonologue ? 'italic' : ''} ${isInnerMonologue ? 'text-foreground/90' : ''}`}>
        {dialogue.text}
      </div>

      {/* Options (if branching) */}
      {hasOptions && (
        <div className="flex flex-col gap-(--inner-gap) mt-(--inner-mt)">
          {dialogue.options!.map((option, index) => (
            <button
              key={index}
              className="w-full text-left px-(--btn-px) py-(--btn-py) bg-secondary border border-border/50 rounded-lg text-[var(--text-label)] text-foreground hover:bg-accent/20 hover:border-accent transition-all duration-150 cursor-pointer"
              onClick={() => { withClickSound(() => onSelectOption(option.nextId, option.choice))(); }}
            >
              <span className="text-primary mr-2 font-bold">{index + 1}.</span>
              {option.text}
            </button>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Back Button */}
        <button
          className={`text-xs font-semibold px-2 py-1 rounded transition-all duration-150 ${
            canGoBack
              ? 'text-primary/70 hover:text-primary hover:bg-primary/10 cursor-pointer'
              : 'text-foreground/20 cursor-not-allowed'
          }`}
          onClick={canGoBack && onGoBack ? (e) => { e.stopPropagation(); withClickSound(onGoBack)(); } : (e) => e.stopPropagation()}
          disabled={!canGoBack}
          aria-label="Go back"
        >
          ← Back
        </button>
        {!hasOptions && (
          <div className="flex text-primary text-right blink-animation self-end font-semibold">
            Click to continue...
          </div>
        )}
      </div>
    </div>
  );
};
