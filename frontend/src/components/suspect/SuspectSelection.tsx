// components/SuspectSelection.tsx
import React from 'react'

interface SuspectSelectionProps {
  suspects: string[];
  onSelect: (index: number) => void;
}

export const SuspectSelection: React.FC<SuspectSelectionProps> = ({ suspects, onSelect }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 z-50">
      <h2 className="text-white text-2xl mb-4">Who is guilty?</h2>
      <div className="flex gap-4 flex-wrap justify-center">
        {suspects.map((img, index) => (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className="hover:scale-105 transition-transform"
          >
            <img src={img} alt={`Suspect ${index + 1}`} className="w-32 h-32 object-contain rounded" />
          </button>
        ))}
      </div>
    </div>
  );
};
