import React from 'react';
import { DialogueNode } from './dialogueData';
import { TutorialChoice } from './ChoicesManager';

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
      className={`flex flex-col z-10 justify-between gap-4 w-[750px] max-w-[90vw] min-h-[120px] bg-gradient-to-br from-nexum-light-start/95 via-nexum-light-middle/95 to-nexum-light-end/95 border-2 border-nexum-border rounded-xl p-8 select-none transition-all duration-100 ${
        !hasOptions ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(251,191,36,0.3)]' : ''
      }`}
      onClick={!hasOptions ? onAdvance : undefined}
    >
      {/* Dialogue Text */}
      <div className="flex text-nexum-text leading-relaxed px-2 font-medium">
        {dialogue.text}
      </div>

      {/* Options (if branching) */}
      {hasOptions && (
        <div className="flex flex-col gap-3 mt-4">
          {dialogue.options!.map((option, index) => (
            <button
              key={index}
              className="w-full text-left px-4 py-3 bg-nexum-light-start border border-nexum-border/50 rounded-lg text-nexum-text hover:bg-nexum-accent/20 hover:border-nexum-border transition-all duration-150 cursor-pointer"
              onClick={() => onSelectOption(option.nextId, option.choiceKey)}
            >
              <span className="text-nexum-accent mr-2 font-bold">{index + 1}.</span>
              {option.text}
            </button>
          ))}
        </div>
      )}

      {/* Footer (only for non-branching dialogue) */}
      {!hasOptions && (
        <div className="flex text-sm text-nexum-accent text-right blink-animation self-end font-semibold">
          Click to continue...
        </div>
      )}
    </div>
  );
};
