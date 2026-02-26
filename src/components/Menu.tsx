import React, { useState, useEffect } from 'react';
import SchoolBackground from '../../assets/SchoolBackground.png';
import { useNavigate } from 'react-router-dom';


// Set the background image 
let currentBackground = SchoolBackground;

/**
 * LayoutDialogue component - handles dialogue flow with branching support
 */
export const Menu: React.FC = () => {
    const navigate = useNavigate();

    const handleStartGame = (): void => {
        console.log('Start Game button clicked!');
        // Navigate to GameContainer to start the game
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
        {/* Game Title & Subtitle */}
        <div className="flex flex-col items-center justify-center mt-20">
          <h1 className="text-primary font-bold text-6xl mb-4" style={{ fontFamily: 'Segoe UI' }}>
            NEXUM
          </h1>
        </div>

        {/* Buttons*/}
        <div className="flex flex-col items-center justify-center mb-20 pointer-events-auto">
            <button className="
                start-button bg-primary text-white font-bold rounded mb-4 cursor-pointer transition-transform transition-shadow hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20
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


