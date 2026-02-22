import React from 'react';
import { TutorialChoice } from './ChoicesManager';
import { DialogueNode } from './DialogueData.ts';

type DialogueBoxProps = {
  dialogue: DialogueNode | null;
  onAdvance: () => void;
  onSelectOption: (nextId: string, choiceKey?: TutorialChoice) => void;
  isVisible: boolean;
};

/**
 * DialogueBox - React component for displaying dialogue text with optional branching choices
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
      className={`flex flex-col z-10 justify-between gap-4 w-[750px] max-w-[90vw] min-h-[120px] bg-gradient-to-br from-[var(--chart-3)]/95 via-[var(--chart-4)]/95 to-[var(--chart-5)]/95 border-2 border-border rounded-xl p-8 select-none transition-all duration-100 ${
        !hasOptions ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20' : ''
      }`}
      onClick={!hasOptions ? onAdvance : undefined}
    >
      {/* Speaker Name (hide for Narrator) */}
      {dialogue.speaker && dialogue.speaker !== 'Narrator' && (
        <div className="flex text-sm text-primary font-semibold">
          {dialogue.speaker}
        </div>
      )}
      {/* Dialogue Text (italic for Narrator) */}
      <div className={`flex text-base leading-relaxed px-2 font-medium ${dialogue.speaker === 'Narrator' ? 'italic' : ''}`}>
        {dialogue.text}
      </div>

      {/* Options (if branching) */}
      {hasOptions && (
        <div className="flex flex-col gap-3 mt-4">
          {dialogue.options!.map((option, index) => (
            <button
              key={index}
              className="w-full text-left px-4 py-3 bg-secondary border border-border/50 rounded-lg text-foreground hover:bg-accent/20 hover:border-accent transition-all duration-150 cursor-pointer"
              onClick={() => onSelectOption(option.nextId, option.choiceKey)}
            >
              <span className="text-primary mr-2 font-bold">{index + 1}.</span>
              {option.text}
            </button>
          ))}
        </div>
      )}

      {/* Footer (only for non-branching dialogue) */}
      {!hasOptions && (
        <div className="flex text-sm text-primary text-right blink-animation self-end font-semibold">
          Click to continue...
        </div>
      )}
    </div>
  );
};
