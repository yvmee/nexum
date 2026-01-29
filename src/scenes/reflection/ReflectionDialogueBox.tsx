import React, { useState, useEffect, useRef } from 'react';
import { ReflectionNode } from './reflectionData';

/**
 * ReflectionDialogueBox - Dialogue box positioned at the top
 */
export interface ReflectionDialogueBoxProps {
  dialogue: ReflectionNode | null;
  onAdvance: () => void;
  onSubmitInput: (input: string) => void;
  isVisible: boolean;
  isAwaitingInput: boolean;
}

export const ReflectionDialogueBox: React.FC<ReflectionDialogueBoxProps> = ({
  dialogue,
  onAdvance,
  onSubmitInput,
  isVisible,
  isAwaitingInput,
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

  return (
    <div
      className={`flex flex-col z-10 justify-between gap-4 w-[750px] max-w-[90vw] min-h-[120px] bg-gradient-to-br from-nexum-light-start/95 via-nexum-light-middle/95 to-nexum-light-end/95 border-2 border-nexum-border rounded-xl p-8 select-none transition-all duration-100 ${
        !isAwaitingInput ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(251,191,36,0.3)]' : ''
      }`}
      onClick={!isAwaitingInput ? onAdvance : undefined}
    >
      {/* Dialogue Text */}
      <div className="flex text-nexum-text leading-relaxed px-2 font-medium">
        {dialogue.text}
      </div>

      {/* Input Field (if required) */}
      {isAwaitingInput && (
        <div className="flex flex-col gap-3 mt-4">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={dialogue.inputPrompt || 'Enter your response...'}
            className="w-full px-4 py-3 bg-nexum-light-start border border-nexum-border/50 rounded-lg text-nexum-text placeholder-gray-500 resize-none focus:outline-none focus:border-nexum-border transition-all duration-150"
            rows={3}
          />
          <button
            onClick={handleSubmit}
            disabled={!inputValue.trim()}
            className="self-end px-6 py-2 bg-nexum-accent text-nexum-text font-bold rounded-lg hover:bg-[#d97706] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer"
          >
            Submit
          </button>
        </div>
      )}

      {/* Footer (only for non-input dialogue) */}
      {!isAwaitingInput && (
        <div className="flex text-sm text-[#fbbf24] text-right blink-animation self-end">
          Click to continue...
        </div>
      )}
    </div>
  );
};
