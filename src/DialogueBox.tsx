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
      className="flex flex-col z-10 justify-between gap-4 w-[750px] max-w-[90vw] min-h-[120px] bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 border-2 border-[#e94560] rounded-xl p-8 cursor-pointer select-none transition-all duration-100 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(233,69,96,0.3)]"
      onClick={onAdvance}
    >
      {/* Content */}
      <div className="flex text-[2xl] text-[#e0e0e0] leading-relaxed px-2">
        {dialogues[currentIndex]}
      </div>

      {/* Footer */}
      <div className="flex text-sm text-[#e94560] text-right blink-animation self-end">
        Click to continue...
      </div>
    </div>
  );
};
