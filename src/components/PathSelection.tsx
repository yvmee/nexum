import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { withClickSound } from '../store/useSoundStore';
import { characters } from '../storydata/assetData';

/**
 * Overlay shown over running game to select 
 * Doctoral Candidate or Student Tutor path
 */
export const PathSelection: React.FC = () => {
  const selectPath = useGameStore((s) => s.selectPath);

  return (
    <div className="absolute inset-0 z-60 flex flex-col items-center justify-center gap-8 p-8 bg-black/50 backdrop-blur-md">
      {/* Prompt */}
      <h1 className="text-center text-white font-bold [font-size:var(--text-speaker)] tracking-widest drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
        Which path will you take?
      </h1>

      {/* Path options */}
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl">
        <button
          onClick={withClickSound(() => selectPath('phd'))}
          className="
            group flex-1 flex flex-col items-center gap-4 rounded-2xl p-6 cursor-pointer
            bg-white/10 border border-white/25 backdrop-blur-sm
            transition-all duration-300 ease-out
            hover:bg-white/20 hover:border-white/60 hover:scale-105
            hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]
          "
        >
          <img
            src={characters.phd}
            alt="Doctoral Candidate"
            className="h-(--portrait-size) object-contain"
          />
          <span className="text-white uppercase tracking-widest font-bold [font-size:var(--text-label)]">
            Doctoral Candidate
          </span>
        </button>

        <button
          onClick={withClickSound(() => selectPath('tutor'))}
          className="
            group flex-1 flex flex-col items-center gap-4 rounded-2xl p-6 cursor-pointer
            bg-white/10 border border-white/25 backdrop-blur-sm
            transition-all duration-300 ease-out
            hover:bg-white/20 hover:border-white/60 hover:scale-105
            hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]
          "
        >
          <img
            src={characters.mayra}
            alt="Student Tutor"
            className="h-(--portrait-size) object-contain"
          />
          <span className="text-white uppercase tracking-widest font-bold [font-size:var(--text-label)]">
            Student Tutor
          </span>
        </button>
      </div>
    </div>
  );
};
