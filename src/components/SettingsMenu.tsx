import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSoundStore, withClickSound } from '../store/useSoundStore';

export const SettingsMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const masterVolume = useSoundStore((s) => s.masterVolume);
  const setMasterVolume = useSoundStore((s) => s.setMasterVolume);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleMainMenu = () => {
    setIsOpen(false);
    void navigate('/');
  };

  const handleEndPage = () => {
    setIsOpen(false);
    void navigate('/endpage');
  };

  const handleEvaluation = () => {
    setIsOpen(false);
    void navigate('/evaluation');
  }

  return (
    <>
      {/* Gear Button */}
      {!isOpen && (
        <button
          onClick={withClickSound(handleOpen)}
          className="absolute top-4 left-4 z-60 p-3 rounded-full bg-black/40 hover:bg-black/60 text-white/80 hover:text-white transition-colors cursor-pointer"
          aria-label="Open settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      )}

      {/* Settings Overlay */}
      {isOpen && (
        <div className="absolute inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="relative bg-background/95 rounded-xl p-8 w-[min(400px,85vw)] shadow-2xl">
            {/* Close button */}
            <button
              onClick={withClickSound(handleClose)}
              className="absolute top-3 left-3 p-1.5 rounded-full hover:bg-foreground/10 text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
              aria-label="Close settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Title */}
            <h2 className="text-center text-foreground font-bold text-xl mb-6">Settings</h2>

            {/* Volume Control */}
            <div className="mb-8">
              <label className="block text-foreground/80 text-sm font-medium mb-2">
                Volume: {Math.round(masterVolume * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={masterVolume}
                onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={withClickSound(handleMainMenu)}
                className="w-full bg-primary text-primary-foreground font-bold rounded py-2.5 px-4 cursor-pointer transition-transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20"
              >
                Return to Main Menu
              </button>
              <button
                onClick={withClickSound(handleEndPage)}
                className="w-full bg-primary text-primary-foreground font-bold rounded py-2.5 px-4 cursor-pointer transition-transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20"
              >
                End Page
              </button>
              <button
                onClick={withClickSound(handleEndPage)}
                className="w-full bg-primary text-primary-foreground font-bold rounded py-2.5 px-4 cursor-pointer transition-transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20"
              >
                Evaluation
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
