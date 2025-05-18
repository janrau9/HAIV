import { motion } from 'framer-motion'
import React from 'react'
import { useGameStore } from '../../store'

interface SuspectSelectorProps {
  onSelect: (suspectId: string) => void
}

export const SuspectSelector: React.FC<SuspectSelectorProps> = ({
  onSelect,
}) => {
  const suspects = useGameStore((state) => state.suspects)
  const questionCounts = useGameStore((state) => state.questionCounts)
  const currentSuspectId = useGameStore((state) => state.currentSuspectId)

  // Map suspects to buttons (first 4 suspects)
  const buttons = [
    { key: 'A', suspect: suspects[0] },
    { key: 'B', suspect: suspects[1] },
    { key: 'C', suspect: suspects[2] },
    { key: 'D', suspect: suspects[3] },
  ]

  return (
    <div className="h-full bg-black bg-opacity-70 border border-green-500 text-green-500 font-mono w-full">
      <div className="text-center p-2">
        <h3 className="font-bold">SELECT SUSPECT</h3>
      </div>
      <div className="grid grid-cols-2 gap-2 p-2">
        {buttons.map(({ key, suspect }) => (
          <motion.button
            key={key}
            onClick={() => onSelect(suspect.id)}
            className={`p-2 border text-center ${
              currentSuspectId === suspect.id
                ? 'bg-green-800 border-green-500'
                : 'bg-black border-green-500'
            } flex flex-col justify-center items-center`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={questionCounts[suspect.id] <= 0}
          >
            <span className="font-bold text-sm">{suspect.name}</span>
            <div className="text-xs opacity-70">
              Questions: {questionCounts[suspect.id]}/4
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
