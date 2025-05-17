import React from 'react'
import { motion } from 'framer-motion'

interface SuspicionMeterProps {
  suspicionLevel: number
  maxLevel?: number
}

export const SuspicionMeter: React.FC<SuspicionMeterProps> = ({
  suspicionLevel,
  maxLevel = 10,
}) => {
  // Calculate the fill percentage
  const fillPercentage = Math.min(100, (suspicionLevel / maxLevel) * 100)

  // Determine the color based on suspicion level
  const getColor = () => {
    if (fillPercentage < 30) return 'rgb(74, 222, 128)' // green-400
    if (fillPercentage < 60) return 'rgb(250, 204, 21)' // yellow-400
    return 'rgb(248, 113, 113)' // red-400
  }

  return (
    <div className="mt-2">
      <div className="flex items-center mb-1">
        <span className="text-xs font-mono mr-2">SUSPICION:</span>
        <span className="text-xs font-mono">
          {suspicionLevel}/{maxLevel}
        </span>
      </div>

      <div className="h-4 w-full bg-gray-200 rounded-sm overflow-hidden border border-black">
        <motion.div
          className="h-full rounded-sm"
          style={{
            backgroundColor: getColor(),
            width: `${fillPercentage}%`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${fillPercentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  )
}
