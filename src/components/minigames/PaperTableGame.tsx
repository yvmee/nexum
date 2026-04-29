import React, { useState } from 'react';
import * as motion from "motion/react-client";
import { AnimatePresence } from 'motion/react';
import tableimage from '../../../assets/props/TableTop.png';
import { useSoundStore } from '../../store/useSoundStore';

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

const renderPaperText = (text: string) => {
  return text.split('\n').map((line, lineIndex) => {
    const segments = line.split(/(\*\*.*?\*\*)/g);

    return (
      <React.Fragment key={`line-${lineIndex}`}>
        {segments.map((segment, segmentIndex) => {
          const isBold = segment.startsWith('**') && segment.endsWith('**') && segment.length > 4;

          if (isBold) {
            return <strong key={`segment-${lineIndex}-${segmentIndex}`}>{segment.slice(2, -2)}</strong>;
          }

          return <React.Fragment key={`segment-${lineIndex}-${segmentIndex}`}>{segment}</React.Fragment>;
        })}
        {lineIndex < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    );
  });
};

export const PaperTableGame: React.FC<PaperTableGameProps> = ({ onComplete, papers }) => {
  // Tracks which paper is currently shown in reading overlay, null if none
  const [activePaperId, setActivePaperId] = useState<number | null>(null);

  const activePaper = papers.find((p) => p.id === activePaperId);
  const playSfx = useSoundStore((s) => s.playSfx);

  return (
    // Table background 
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden" style={{ backgroundImage: `url(${tableimage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* Top-Down Table View with Papers */}
      <div className="absolute inset-0">
        {papers.map((paper) => (
          <motion.div
            key={paper.id}
            className="absolute w-(--paper-width) h-(--paper-height) bg-[#f4e4bc] shadow-lg cursor-pointer hover:shadow-xl transition-shadow flex items-center justify-center p-2 [font-size:var(--title-size)] text-center border border-[#d2b48c]"
            style={{ left: paper.x, top: paper.y, rotate: paper.rotate }}
            whileHover={{ scale: 1.05 }}
            onClick={() => { playSfx('click'); setActivePaperId(paper.id); }}
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
              className="w-96 min-h-100 bg-[#f4e4bc] text-black p-8 shadow-2xl flex flex-col cursor-auto border border-[#d2b48c]"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20, opacity: 0 }}
            >
              <h2 className="[font-size:var(--title-size)] font-bold mb-4 border-b border-black pb-2">{activePaper.title}</h2>
              <p className="font-serif [font-size:var(--title-size)] leading-relaxed">{renderPaperText(activePaper.text)}</p>
              
              <button 
                className="mt-auto self-end text-sm text-gray-600 hover:text-black"
                onClick={() => setActivePaperId(null)}
              >
                (Click to put down)
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leave Table Button */}
      {!activePaper && (
        <div className="absolute bottom-10 z-10 flex w-full justify-center">
          <button
            onClick={() => { playSfx('click'); onComplete(); }}
            className="px-6 py-3 bg-white text-black font-bold uppercase tracking-wider rounded shadow hover:bg-gray-200 transition-colors"
          >
            Leave Table
          </button>
        </div>
      )}
    </div>
  );
};