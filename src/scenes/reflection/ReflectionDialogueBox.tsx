import React, { useState, useEffect, useRef } from 'react';
import { ReflectionNode, ReflectionOption } from '../../storydata/reflectionData';

/**
 * Dialogue box positioned at the top for ReflectionNodes
 */
export interface ReflectionDialogueBoxProps {
  dialogue: ReflectionNode | null;
  onAdvance: () => void;
  onSubmitInput: (input: string) => void;
  onSelectOption: (nextId: string, choice?: Record<string, string | boolean | number>) => void;
  isVisible: boolean;
  isAwaitingInput: boolean;
  canContinue?: boolean;
}

export const ReflectionDialogueBox: React.FC<ReflectionDialogueBoxProps> = ({
  dialogue,
  onAdvance,
  onSubmitInput,
  onSelectOption,
  isVisible,
  isAwaitingInput,
  canContinue = true,
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isAwaitingInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAwaitingInput]);

  if (!isVisible || !dialogue) {
    return null;
  }

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onSubmitInput(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const hasOptions = !!dialogue?.options?.length;
  const canClick = !isAwaitingInput && !hasOptions && canContinue;

  return (
    <div
      className={`flex flex-col z-10 justify-between gap-[var(--box-gap)] w-[var(--box-width)] max-w-[90vw] min-h-[var(--box-min-height)] bg-gradient-to-br from-[var(--chart-3)]/95 via-[var(--chart-4)]/95 to-[var(--chart-5)]/95 border-2 border-border rounded-xl p-[var(--box-padding)] select-none transition-all duration-100 ${
        canClick ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20' : ''
      }`}
      onClick={canClick ? onAdvance : undefined}
    >
      {/* Dialogue Text */}
      <div className="flex text-[var(--text-body)] text-foreground leading-relaxed px-[var(--inner-px)] font-medium">
        {dialogue.text}
      </div>

      {/* Input Field (if required) */}
      {isAwaitingInput && (
        <div className="flex flex-col gap-[var(--inner-gap)] mt-[var(--inner-mt)]">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={dialogue.inputPrompt || 'Enter your response...'}
            className="w-full px-[var(--btn-px)] py-[var(--btn-py)] bg-secondary border border-border/50 rounded-lg text-[var(--text-label)] text-foreground placeholder-gray-500 resize-none focus:outline-none focus:border-primary transition-all duration-150"
            rows={3}
          />
          <button
            onClick={handleSubmit}
            disabled={!inputValue.trim()}
            className="self-end px-[var(--submit-px)] py-[var(--submit-py)] bg-primary text-[var(--text-label)] text-primary-foreground font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer"
          >
            Submit
          </button>
        </div>
      )}

      {/* Options (if present) */}
      {hasOptions && !isAwaitingInput && (
        <div className="flex flex-col gap-2 mt-[var(--inner-mt)]">
          {dialogue!.options!.map((option: ReflectionOption) => (
            <button
              key={option.nextId}
              onClick={(e) => { e.stopPropagation(); onSelectOption(option.nextId, option.choice); }}
              className="w-full px-[var(--btn-px)] py-[var(--btn-py)] bg-secondary border border-border/50 rounded-lg text-[var(--text-label)] text-foreground font-medium hover:bg-primary/20 hover:border-primary transition-all duration-150 cursor-pointer text-left"
            >
              {option.text}
            </button>
          ))}
        </div>
      )}

      {/* Footer (only for non-input, non-options dialogue) */}
      {!isAwaitingInput && !hasOptions && canContinue && (
        <div className="flex text-[var(--text-hint)] text-primary text-right blink-animation self-end">
          Click to continue...
        </div>
      )}
    </div>
  );
};
