import React from 'react';
import { DialogueNode } from '../../storydata/dialogueData.ts';

type DialogueBoxProps = {
  dialogue: DialogueNode | null;
  onAdvance: () => void;
  onSelectOption: (nextId: string, choice?: Record<string, string | boolean | number>) => void;
  isVisible: boolean;
};

/**
 * React component for displaying dialogue text with optional branching choices
 */
export const DialogueBox: React.FC<DialogueBoxProps> = ({
  dialogue,
  onAdvance,
  onSelectOption,
  isVisible,
}) => {
  if (!isVisible || !dialogue) {
    return null;
  }

  const hasOptions = dialogue.options && dialogue.options.length > 0;

  return (
    <div
      className={`flex flex-col z-10 justify-between gap-[var(--box-gap)] w-[var(--box-width)] max-w-[90vw] min-h-[var(--box-min-height)] bg-gradient-to-br from-[var(--chart-3)]/95 via-[var(--chart-4)]/95 to-[var(--chart-5)]/95 border-2 border-border rounded-xl p-[var(--box-padding)] select-none transition-all duration-100 ${
        !hasOptions ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20' : ''
      }`}
      onClick={!hasOptions ? onAdvance : undefined}
    >
      {/* Speaker Name (hide for Narrator) */}
      {dialogue.speaker && dialogue.speaker !== 'Narrator' && (
        <div className="flex text-[var(--text-label)] text-primary font-semibold">
          {dialogue.speaker}
        </div>
      )}
      {/* Dialogue Text (italic for Narrator) */}
      <div className={`flex text-[var(--text-body)] leading-relaxed px-[var(--inner-px)] font-medium ${dialogue.speaker === 'Narrator' ? 'italic' : ''}`}>
        {dialogue.text}
      </div>

      {/* Options (if branching) */}
      {hasOptions && (
        <div className="flex flex-col gap-[var(--inner-gap)] mt-[var(--inner-mt)]">
          {dialogue.options!.map((option, index) => (
            <button
              key={index}
              className="w-full text-left px-[var(--btn-px)] py-[var(--btn-py)] bg-secondary border border-border/50 rounded-lg text-[var(--text-label)] text-foreground hover:bg-accent/20 hover:border-accent transition-all duration-150 cursor-pointer"
              onClick={() => onSelectOption(option.nextId, option.choice)}
            >
              <span className="text-primary mr-2 font-bold">{index + 1}.</span>
              {option.text}
            </button>
          ))}
        </div>
      )}

      {/* Footer (only for non-branching dialogue) */}
      {!hasOptions && (
        <div className="flex text-[var(--text-hint)] text-primary text-right blink-animation self-end font-semibold">
          Click to continue...
        </div>
      )}
    </div>
  );
};
