import React from 'react'
import { motion } from 'framer-motion'
import { Meter } from './Meter'
import type { SuspectSummary } from '../../../../types/types'

interface SuspectSelectionProps {
  suspects: SuspectSummary[]
  onSelect: (index: number) => void
}

export const SuspectSelection: React.FC<SuspectSelectionProps> = ({
  suspects,
  onSelect,
}) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.2,
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  // Security camera filter effect CSS
  const securityCameraStyle = {
    filter: 'sepia(0.3) hue-rotate(90deg) brightness(0.8) contrast(1.2)',
    boxShadow:
      'inset 0 0 30px rgba(0, 255, 0, 0.3), 0 0 10px rgba(0, 255, 0, 0.5)',
  }

  // Get current timestamp for the recording display
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })

  return (
    <motion.div
      className="w-full h-full bg-black p-6 flex flex-col items-center justify-center"
      style={securityCameraStyle}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Recording info header */}
      <div className="w-full flex justify-between text-green-500 font-mono text-sm mb-4 px-4">
        <div>REC • {currentTime}</div>
        <div>CAM-04 :: FINAL ACCUSATION</div>
      </div>

      {/* Scanline effect overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden opacity-20">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="w-full h-px bg-green-500"
            style={{
              position: 'absolute',
              top: `${i * 10}px`,
              opacity: i % 3 === 0 ? 0.8 : 0.3,
            }}
          />
        ))}
      </div>

      <motion.div
        className="mb-6 font-mono text-green-500 text-center"
        variants={itemVariants}
      >
        <h1 className="text-3xl uppercase font-bold mb-2">Who is guilty?</h1>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 w-[80%]"
        variants={itemVariants}
      >
        {suspects.map((suspect, index) => (
          <motion.div
            key={suspect.id}
            className="cursor-pointer relative bg-black border border-green-500 overflow-hidden"
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 15px rgba(0, 255, 0, 0.5)',
            }}
            onClick={() => onSelect(index)}
            variants={itemVariants}
          >
            {/* Suspect image with surveillance effect */}
            <div className="relative h-48 flex items-center justify-center bg-black overflow-hidden">
              {/* Background for suspect */}
              <div className="absolute inset-0 bg-black">
                <div className="w-full h-full bg-green-900 opacity-10" />
              </div>

              {/* Brick wall background */}
              <img
                src="/images/wall.png"
                alt="Wall"
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />

              {/* Suspect image */}
              <img
                src={suspect.mugshot}
                alt={suspect.name}
                className="w-full h-full object-contain relative z-10"
              />

              {/* Recording marker */}
              <div className="absolute top-2 right-2 flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse" />
                <span className="text-green-300 text-xs font-mono">REC</span>
              </div>

              {/* Scan effect */}
              <motion.div
                className="absolute top-0 left-0 w-full h-2 bg-green-500 opacity-20"
                animate={{
                  y: [0, 180, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </div>

            {/* Suspect info with monitor styling */}
            <div className="bg-black p-3 border-t border-green-500">
              <p className="text-green-500 font-mono text-center font-bold truncate">
                {suspect.name}
              </p>

              {/* Use the Meter component for consistency */}
              <div className="mt-2">
                <Meter
                  label="SUSPICION"
                  value={suspect.suspicion || 0}
                  maxValue={10}
                  colorScheme="suspicion"
                  showLabel={false}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Warning notice */}
      <motion.div
        className="mt-6 border border-green-500 p-3 text-green-500 font-mono text-center text-sm max-w-md"
        variants={itemVariants}
      >
        <p className="font-bold mb-1">WARNING</p>
        <p>This will end your investigation. Choose carefully, detective.</p>
      </motion.div>
    </motion.div>
  )
}
