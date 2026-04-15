import React, { useState } from 'react';
import * as motion from "motion/react-client";
import { AnimatePresence } from 'motion/react';
import tableimage from '../../../assets/props/TableTop.png';

export interface Paper {
  id: number;
  title: string;
  text: string;
  x: string;
  y: string;
  rotate: number;
}

interface PaperTableGameProps {
  onComplete: () => void;
  papers: Paper[];
}

export const PAPERS: Paper[] = [ // Paper text data 
  { id: 1, title: 'Motivate Your Students!', text: 'Bring along visual aids or establish a practical connection.\n\nUse your own enthusiasm for the topic to interest the students in the subject and the content being covered.', 
      x: '60%', y: '40%', rotate: 25 },
  { id: 2, title: 'A Positive Atmosphere ', text: 'Create a positive atmosphere by approaching students with openness. Create eye contact and use open facial expressions and gestures. Take their wishes and concerns seriously. This isn’t the place for fearmongering, irony or sarcasm.', 
      x: '35%', y: '20%', rotate: 5 },
  { id: 3, title: 'Structure', text: 'At the beginning of the tutorial, provide an overview of the topics to be covered. An agenda, a simple list, a mind map, or a learning map are great options for this.\n\nSpecifically state the learning outcomes your event should achieve so that students know what learning gains they can expect.\n\n At the beginning of each lesson, make a connection to the previous one in order to build on the students\' prior knowledge. You can use a mind map, cluster or a quiz for this.', 
      x: '10%', y: '30%', rotate: -15 },
];

export const PaperTableGame: React.FC<PaperTableGameProps> = ({ onComplete, papers }) => {
  // Tracks which paper is currently shown in reading overlay, null if none
  const [activePaperId, setActivePaperId] = useState<number | null>(null);

  const activePaper = papers.find((p) => p.id === activePaperId);

  return (
    // Table background 
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden" style={{ backgroundImage: `url(${tableimage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* Top-Down Table View with Papers */}
      <div className="absolute inset-0">
        {papers.map((paper) => (
          <motion.div
            key={paper.id}
            className="absolute w-65 h-90 bg-[#f4e4bc] shadow-lg cursor-pointer hover:shadow-xl transition-shadow flex items-center justify-center p-2 text-xs text-center border border-[#d2b48c]"
            style={{ left: paper.x, top: paper.y, rotate: paper.rotate }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setActivePaperId(paper.id)}
          >
            {paper.title}
          </motion.div>
        ))}
      </div>

      {/* Paper Reading Overlay */}
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