import React, { useState } from 'react';

interface SortingGameProps {
  onComplete: (selectedItemIds: number[]) => void;
}

const ITEMS = [
  { id: 1, text: 'Give an overview over the topics of whole semester' },
  { id: 2, text: 'Warn them about failing if they don\'t do enough' },
  { id: 3, text: 'State the learning outcomes of today\'s session' },
  { id: 4, text: 'Tell them, what you think is the most interesting use of the calculations you will practice today' },
  { id: 5, text: 'Have an elaborative introduction round' },
  { id: 6, text: 'Have a quick introduction round' },
  { id: 7, text: 'Ask them about their wishes and concerns for the next tutorials' },
  { id: 8, text: 'Make a joke about how they are all doomed' },
];


const SLOT_COUNT = 4;

export const SortingGame: React.FC<SortingGameProps> = ({ onComplete }) => {
  const [slots, setSlots] = useState<(number | null)[]>(Array(SLOT_COUNT).fill(null));
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);

  const placedIds = slots.filter((s): s is number => s !== null);

  const handleDragStartItem = (e: React.DragEvent, id: number) => {
    e.dataTransfer.setData('itemId', String(id));
    e.dataTransfer.setData('fromSlot', '-1');
  };

  const handleDragStartSlot = (e: React.DragEvent, id: number, slotIndex: number) => {
    e.dataTransfer.setData('itemId', String(id));
    e.dataTransfer.setData('fromSlot', String(slotIndex));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragOverSlot = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    setDragOverSlot(slotIndex);
  };

  const handleDragLeaveSlot = () => {
    setDragOverSlot(null);
  };

  const handleDropOnSlot = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    setDragOverSlot(null);
    const id = parseInt(e.dataTransfer.getData('itemId'));
    const fromSlot = parseInt(e.dataTransfer.getData('fromSlot'));
    setSlots((prev) => {
      const next = [...prev];
      if (fromSlot >= 0) next[fromSlot] = null;
      next[slotIndex] = id;
      return next;
    });
  };

  const handleDropOnPool = (e: React.DragEvent) => {
    e.preventDefault();
    const fromSlot = parseInt(e.dataTransfer.getData('fromSlot'));
    if (fromSlot >= 0) {
      setSlots((prev) => {
        const next = [...prev];
        next[fromSlot] = null;
        return next;
      });
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden backdrop-blur-sm bg-black/10">
      <h2 className="text-white text-base font-bold mb-6 uppercase tracking-widest">
        Choose how to start your tutorial! Drag and drop your selected elements to your right.
      </h2>

      <div className="flex items-center gap-8">

        {/*Item blocks to sort (left)*/}
        <div
          className="grid grid-cols-2 gap-3"
          onDragOver={handleDragOver}
          onDrop={handleDropOnPool}
        >
          {ITEMS.map((item) => {
            const isPlaced = placedIds.includes(item.id);
            return (
              <div
                key={item.id}
                draggable={!isPlaced}
                onDragStart={!isPlaced ? (e) => handleDragStartItem(e, item.id) : undefined}
                className="w-32 h-20 flex items-center justify-center text-xs text-center p-2 rounded border transition-all select-none"
                style={isPlaced
                  ? { opacity: 0.25, backgroundColor: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--muted-foreground)', cursor: 'not-allowed' }
                  : { backgroundColor: 'var(--secondary)', borderColor: 'var(--ring)', color: 'var(--secondary-foreground)', cursor: 'grab' }
                }
                onMouseEnter={!isPlaced ? e => (e.currentTarget.style.opacity = '0.85') : undefined}
                onMouseLeave={!isPlaced ? e => (e.currentTarget.style.opacity = isPlaced ? '0.25' : '1') : undefined}
              >
                {item.text}
              </div>
            );
          })}
        </div>

        {/* Downward arrows aligned with slots (middle) */}
        <div className="flex flex-col items-center justify-center gap-3">
          {Array(SLOT_COUNT).fill(null).map((_, i) => (
            <div key={i} className="w-8 h-20 flex items-center justify-center">
              <svg width="20" height="28" viewBox="0 0 20 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="10" y1="0" x2="10" y2="20" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
                <path d="M3 16 L10 26 L17 16" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          ))}
        </div>

        {/* Drop slots (right) */}
        <div className="flex flex-col gap-3">
          {slots.map((slotItemId, slotIndex) => {
            const slotItem = slotItemId !== null ? ITEMS.find((i) => i.id === slotItemId) : null;
            const isHovered = dragOverSlot === slotIndex;
            return (
              <div
                key={slotIndex}
                onDragOver={(e) => handleDragOverSlot(e, slotIndex)}
                onDragLeave={handleDragLeaveSlot}
                onDrop={(e) => handleDropOnSlot(e, slotIndex)}
                className="w-32 h-20 flex items-center justify-center text-xs text-center p-2 rounded border-2 border-dashed transition-all"
                style={slotItem
                  ? { backgroundColor: 'var(--secondary)', borderColor: 'var(--ring)', color: 'var(--secondary-foreground)' }
                  : isHovered
                    ? { backgroundColor: 'var(--accent)', borderColor: 'var(--primary)', color: 'var(--accent-foreground)' }
                    : { backgroundColor: 'transparent', borderColor: 'var(--border)', color: 'var(--muted-foreground)' }
                }
              >
                {slotItem ? (
                  <div
                    draggable
                    onDragStart={(e) => handleDragStartSlot(e, slotItem.id, slotIndex)}
                    className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
                  >
                    {slotItem.text}
                  </div>
                ) : (
                  <span className="text-xs pointer-events-none">Drop here</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Done button */}
      <div className="absolute bottom-10 flex justify-center w-full">
        <button
          onClick={() => onComplete(slots.filter((s): s is number => s !== null))}
          disabled={placedIds.length === 0}
          className="px-6 py-3 font-bold uppercase tracking-wider rounded shadow transition-colors disabled:opacity-40 disabled:cursor-not-allowed" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }} onMouseEnter={e => { if (placedIds.length > 0) e.currentTarget.style.opacity = '0.85'; }} onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          Done
        </button>
      </div>
    </div>
  );
};
