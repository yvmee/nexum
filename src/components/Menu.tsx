import React, { useState, useEffect } from 'react';
import SchoolBackground from '../../assets/backgrounds/BackgroundLecturehall.png';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';

let currentBackground = SchoolBackground;

/**
 * Menu page component that serves as the entry point to the game
 */
export const Menu: React.FC = () => {
    const navigate = useNavigate();

    // Navigate to GameContainer to start the game
    const handleStartGame = (): void => {
        console.log('Start Game button clicked!');
        useGameStore.getState().startGame(); 
        navigate('/game');
    }

  return (
    <div className="w-full h-full">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <img 
          src={currentBackground} 
          alt="Background" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-center justify-between w-full h-full p-8 pointer-events-none">
        {/* Game Title */}
        <div className="flex flex-col items-center justify-center mt-20">
          <h1 className="text-primary font-bold text-6xl mb-4" style={{ fontFamily: 'Segoe UI' }}>
            NEXUM
          </h1>
        </div>

        {/* Buttons*/}
        <div className="flex flex-col items-center justify-center mb-20 pointer-events-auto">
            <button className="
                start-button bg-primary font-bold rounded mb-4 cursor-pointer transition-transform transition-shadow hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20
                text-[var(--menu-btn-text)]
                py-[var(--menu-btn-py)]
                px-[var(--menu-btn-px)]
            " onClick={handleStartGame}>
                Start Game
            </button>
        </div>
      </div>
    </div>
  );
};


