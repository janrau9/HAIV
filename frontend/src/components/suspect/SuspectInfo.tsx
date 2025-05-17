import React from 'react'
import { useGameStore } from '../../store'
import { Meter } from './Meter'

export const SuspectInfo: React.FC = () => {
  const suspects = useGameStore((state) => state.suspects)
  const currentSuspectId = useGameStore((state) => state.currentSuspectId)
  const questionCounts = useGameStore((state) => state.questionCounts)

  // Find the current suspect
  const currentSuspect = suspects.find((s) => s.id === currentSuspectId)

  if (!currentSuspect) return null

  return (
    <div className="h-full bg-black bg-opacity-70 border border-green-500 text-green-500 font-mono w-full">
      <div className="px-4 pt-3 flex justify-between items-center">
        <h3 className="text-lg font-bold">{currentSuspect.name}</h3>
        <div className="text-sm text-right">
          <span className="text-xs">QUESTIONS: </span>
          <span className="font-bold">
            {questionCounts[currentSuspect.id]}/4
          </span>
        </div>
      </div>

      <div className="text-sm px-4 pb-2">
        <p>Age: {currentSuspect.age}</p>
        <p>Occupation: {(currentSuspect as any).occupation || 'Unknown'}</p>

        {/* Meters for suspicion and trust */}
        <div className="mt-2">
          <Meter
            label="SUSPICION"
            value={currentSuspect.suspicion}
            colorScheme="suspicion"
          />

          {/* <Meter
            label="TRUST"
            value={currentSuspect.trust}
            colorScheme="trust"
          /> */}
        </div>
      </div>
    </div>
  )
}
