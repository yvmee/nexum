import React from 'react';

interface DialogueBoxProps {
  dialogues: string[];
  currentIndex: number;
  onAdvance: () => void;
  isVisible: boolean;
}

/**
 * DialogueBox - React component for displaying dialogue text that the player can click through
 */
export const DialogueBox: React.FC<DialogueBoxProps> = ({
  dialogues,
  currentIndex,
  onAdvance,
  isVisible,
}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[750px] max-w-[90vw] bg-gradient-to-br from-nexum-border/95 to-nexum-canvas/95 border-2 border-nexum-accent rounded-xl p-5 text-white cursor-pointer select-none transition-all duration-100 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(233,69,96,0.3)]"
      onClick={onAdvance}
    >
      <div className="text-lg leading-relaxed mb-3 min-h-[50px]">
        {dialogues[currentIndex]}
      </div>
      <div className="text-sm text-nexum-accent text-right blink-animation">
        Click to continue...
      </div>
    </div>
  );
};
