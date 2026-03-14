import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GameContainer from './components/GameContainer.tsx';
import { EndPage } from './components/EndPage.tsx';
import { Menu } from './components/Menu.tsx';

/**
 * Provides the main layout structure for the app and sets up routing between pages
 */
export const Layout: React.FC = () => {

  useEffect(() => {
    console.log('App initialized');
  }, []);

  return (
    <BrowserRouter>
      <div className="relative w-screen h-screen overflow-hidden font-sans bg-background">
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/game" element={<GameContainer />} />
          <Route path="/endpage" element={<EndPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};