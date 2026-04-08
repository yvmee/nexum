import React, { useState } from 'react';
import * as motion from "motion/react-client";
import { AnimatePresence } from 'motion/react';

interface PaperTableGameProps {
  onComplete: () => void;
}

const PAPERS = [ // Paper text data etc
  { id: 1, title: 'Motivation', text: 'blabla bla', x: '20%', y: '30%', rotate: -15 },
  { id: 2, title: 'How to talk to students', text: 'Be friendly and open', x: '60%', y: '40%', rotate: 25 },
  { id: 3, title: 'Starting', text: 'Give an overview over all the topics', x: '35%', y: '65%', rotate: 5 },
];

export const PaperTableGame: React.FC<PaperTableGameProps> = ({ onComplete }) => {
  // Tracks which paper is currently shown in reading overlay, null if none
  const [activePaperId, setActivePaperId] = useState<number | null>(null);

  const activePaper = PAPERS.find((p) => p.id === activePaperId);

  return (
    <div className="relative w-full h-full bg-[#3e2723] flex items-center justify-center overflow-hidden">
      {/* Top-Down Table View */}
      <div className="absolute inset-0">
        {PAPERS.map((paper) => (
          <motion.div
            key={paper.id}
            className="absolute w-24 h-32 bg-[#f4e4bc] shadow-lg cursor-pointer hover:shadow-xl transition-shadow flex items-center justify-center p-2 text-xs text-center border border-[#d2b48c]"
            style={{ left: paper.x, top: paper.y, rotate: paper.rotate }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setActivePaperId(paper.id)}
          >
            {paper.title}
          </motion.div>
        ))}
      </div>

      {/* Paper Reading Overlay (Modal) */}
      <AnimatePresence>
        {activePaper && (
          <motion.div
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePaperId(null)} // Click anywhere to close
          >
            <motion.div
              className="w-96 min-h-[400px] bg-[#f4e4bc] text-black p-8 shadow-2xl flex flex-col cursor-auto border border-[#d2b48c]"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} // Prevent clicks on the paper from closing it
            >
              <h2 className="text-xl font-bold mb-4 border-b border-black pb-2">{activePaper.title}</h2>
              <p className="font-serif text-lg leading-relaxed whitespace-pre-wrap">{activePaper.text}</p>
              
              <button 
                className="mt-auto self-end text-sm text-gray-600 hover:text-black"
                onClick={() => setActivePaperId(null)}
              >
                (Click outside to put down)
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leave Table Button */}
      {!activePaper && (
        <div className="absolute bottom-10 z-10 flex w-full justify-center">
          <button
            onClick={onComplete}
            className="px-6 py-3 bg-white text-black font-bold uppercase tracking-wider rounded shadow hover:bg-gray-200 transition-colors"
          >
            Leave Table
          </button>
        </div>
      )}
    </div>
  );
};