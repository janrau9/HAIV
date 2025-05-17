// components/SuspectSelection.tsx
import React from 'react'
import type { SuspectSummary } from '../../../../types/types'

interface SuspectSelectionProps {
  suspects: SuspectSummary[]
  onSelect: (index: number) => void
}

interface SuspectCardProps {
  suspect: SuspectSummary
}

const SuspectCard: React.FC<SuspectCardProps> = ({ suspect }) => {
  return (
    <div className="bg-white p-5 text-center hover:scale-105">
      <div className="relative w-32 h-32 overflow-hidden border-1 border-black">
        <img
          src="/images/gameBoy/walls.png"
          className="w-32 h-32  absolute"
        ></img>
        <img
          src={suspect.mugshot}
          className="w-32 h-32 object-contain absolute"
        />
      </div>
      <p className="font-bold text-black">{suspect.name}</p>
    </div>
  )
}

export const SuspectSelection: React.FC<SuspectSelectionProps> = ({
  suspects,
  onSelect,
}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 z-50">
      <h2 className="text-white text-2xl mb-4">Who is guilty?</h2>
      <div className="flex gap-4 flex-wrap justify-center">
        {suspects.map((suspect, index) => (
          <div key={index} onClick={() => onSelect(index)}>
            <SuspectCard suspect={suspect}></SuspectCard>
          </div>
        ))}
      </div>
    </div>
  )
}
