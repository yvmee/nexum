import React, { useState, useEffect, useRef } from 'react';
import { ReflectionNode, ReflectionOption } from '../../storydata/reflectionData';
import { withClickSound } from '../../store/useSoundStore';

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
      className={`flex flex-col z-10 justify-between gap-(--box-gap) w-(--box-width) max-w-[90vw] min-h-(--box-min-height) bg-linear-to-br from-(--chart-3)/95 via-(--chart-4)/95 to-(--chart-5)/95 border-2 border-border rounded-xl p-(--box-padding) select-none transition-all duration-100 ${
        canClick ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20' : ''
      }`}
      onClick={canClick ? withClickSound(onAdvance) : undefined}>
        
      {/* Dialogue Text */}
      <div className="flex [font-size:var(--text-body)] text-foreground leading-relaxed px-(--inner-px) font-medium">
        {dialogue.text}
      </div>

      {/* Input Field (if required) */}
      {isAwaitingInput && (
        <div className="flex flex-col gap-(--inner-gap) mt-(--inner-mt)">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={dialogue.inputPrompt || 'Enter your response...'}
            className="w-full px-(--btn-px) py-(--btn-py) bg-secondary border border-border/50 rounded-lg [font-size:var(--text-label)] text-foreground placeholder-gray-500 resize-none focus:outline-none focus:border-primary transition-all duration-150"
            rows={3}
          />
          <button
            onClick={withClickSound(handleSubmit)}
            disabled={!inputValue.trim()}
            className="self-end px-(--submit-px) py-(--submit-py) bg-primary text-primary-foreground [font-size:var(--text-label)] font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer"
          >
            Submit
          </button>
        </div>
      )}

      {/* Options (if present) */}
      {hasOptions && !isAwaitingInput && (
        <div className="flex flex-col gap-2 mt-(--inner-mt)">
          {dialogue!.options!.map((option: ReflectionOption) => (
            <button
              key={option.nextId}
              onClick={(e) => { e.stopPropagation(); withClickSound(() => onSelectOption(option.nextId, option.choice))(); }}
              className="w-full text-left [font-size:var(--text-body)] px-(--btn-px) py-(--btn-py) bg-secondary/85 border border-border/50 rounded-lg text-foreground 
              hover:bg-secondary hover:border-primary/40 hover:brightness-110 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              {option.text}
            </button>
          ))}
        </div>
      )}

      {/* Footer (only for non-input, non-options dialogue) */}
      {!isAwaitingInput && !hasOptions && canContinue && (
        <div className="flex text-primary [font-size:var(--text-hint)] text-right blink-animation self-end">
          Click to continue...
        </div>
      )}
    </div>
  );
};
