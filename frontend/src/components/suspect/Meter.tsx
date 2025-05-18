import { motion } from 'framer-motion'
import React from 'react'

interface MeterProps {
  label: string
  value: number
  maxValue?: number
  colorScheme: 'suspicion' | 'trust'
  showLabel?: boolean
}

export const Meter: React.FC<MeterProps> = ({
  label,
  value,
  maxValue = 10,
  colorScheme,
  showLabel = true,
}) => {
  const fillPercentage = Math.min(100, (value / maxValue) * 100)

  const getColor = () => {
    if (colorScheme === 'suspicion') {
      if (fillPercentage < 30) return 'rgb(74, 222, 128)' // green-400
      if (fillPercentage < 60) return 'rgb(250, 204, 21)' // yellow-400
      return 'rgb(248, 113, 113)' // red-400
    } else {
      // Trust meter uses blues
      if (fillPercentage < 30) return 'rgb(96, 165, 250)' // blue-300
      if (fillPercentage < 60) return 'rgb(59, 130, 246)' // blue-400
      return 'rgb(37, 99, 235)' // blue-600
    }
  }

  return (
    <div className="mb-1">
      <div className="flex items-center justify-between text-xs mb-1">
        {showLabel && <span className="font-mono mr-2">{label}:</span>}
        <span className="font-mono">
          {value}/{maxValue}
        </span>
      </div>

      <div className="h-3 w-full bg-gray-900 rounded-sm overflow-hidden border border-green-500">
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
