import React, { useEffect } from 'react';
import SchoolBackground from '../../assets/backgrounds/BackgroundLecturehall.png';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { useSoundStore, withClickSound } from '../store/useSoundStore';

const background = SchoolBackground;

/**
 * End page component stand-in
 */
export const EndPage: React.FC = () => {
    const navigate = useNavigate();
    const stopBgm = useSoundStore((s) => s.stopBgm);

    useEffect(() => {
      stopBgm();
    }, [stopBgm]);

    // Navigate to GameContainer to restart the game
    const handleRestartGame = (): void => {
      console.log('Restart button clicked, restarting game...');
      useGameStore.getState().startGame(); 
      void navigate('/game');
    }

  return (
    <div className="w-full h-full">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <img 
          src={background} 
          alt="Background" 
          className="w-full h-full object-cover transition-transform duration-[10s] ease-in-out hover:scale-105"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80"></div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-center justify-between w-full h-full p-8 pointer-events-none">
      {/* Game Title */}
        <div className="flex flex-col items-center justify-center mt-32">
          <h1 className="text-white font-black text-4xl mb-2 tracking-[0.2em] drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
            Thanks for playing!
          </h1>
        </div>

        {/* Buttons*/}
        <div className="flex flex-col items-center justify-center mb-20 pointer-events-auto">
            <button className="
                group relative overflow-hidden rounded-full
                backdrop-blur-md bg-white/10 border border-white/30 
                text-(--menu-btn-text) text-xl font-bold uppercase tracking-widest
                py-(--menu-btn-py) px-(--menu-btn-px) cursor-pointer
                transition-all duration-300 ease-out
                hover:bg-white/20 hover:border-white/60 hover:scale-105
                hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]
            " onClick={withClickSound(handleRestartGame)}>
                Restart Game
            </button>
        </div>
      </div>
    </div>
  );
};


