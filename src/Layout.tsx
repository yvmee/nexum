import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LayoutDialogue } from './scenes/dialogue/LayoutDialogue.tsx';
import { ReflectionDialogue } from './scenes/reflection/ReflectionDialogue.tsx';

/**
 * Layout component - provides the main layout structure for the app
 */
export const Layout: React.FC = () => {

  return (
    <BrowserRouter>
      <div className="relative w-screen h-screen overflow-hidden font-sans bg-[#16213e]">
        <Routes>
          <Route path="/" element={<LayoutDialogue />} />
          <Route path="/reflection" element={<ReflectionDialogue />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};
