import React from 'react'
import { useGameStore } from '../../store'
import { SuspicionMeter } from './SuspicionMeter'

export const SuspectInfo: React.FC = () => {
  const suspects = useGameStore((state) => state.suspects)
  const currentSuspectId = useGameStore((state) => state.currentSuspectId)
  const questionCounts = useGameStore((state) => state.questionCounts)

  // Find the current suspect
  const currentSuspect = suspects.find((s) => s.id === currentSuspectId)

  if (!currentSuspect) return null

  return (
    <div className="bg-black bg-opacity-70 border border-green-500 text-green-500 font-mono max-w-xs">
      <h3 className="text-lg font-bold mb-1 px-4 pt-3">
        {currentSuspect.name}
      </h3>
      <div className="text-sm px-4 pb-3">
        <p>Age: {currentSuspect.age}</p>
        <p>Occupation: {(currentSuspect as any).occupation || 'Unknown'}</p>
        {(currentSuspect as any).relationship_to_victim && (
          <p>
            Relation to victim: {(currentSuspect as any).relationship_to_victim}
          </p>
        )}

        {/* Add the suspicion meter */}
        <SuspicionMeter suspicionLevel={currentSuspect.suspicion} />

        <div className="mt-3 text-center">
          <span className="text-xs">REMAINING QUESTIONS</span>
          <div className="font-bold text-xl">
            {questionCounts[currentSuspect.id]}/4
          </div>
        </div>
      </div>
    </div>
  )
}
