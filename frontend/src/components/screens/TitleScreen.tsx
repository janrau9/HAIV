import { motion } from 'framer-motion'
import React from 'react'

interface TitleScreenProps {
  onStartGame: () => void
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStartGame }) => {
  // Security camera filter effect CSS
  const securityCameraStyle = {
    filter: 'sepia(0.3) hue-rotate(90deg) brightness(0.8) contrast(1.2)',
    boxShadow:
      'inset 0 0 30px rgba(0, 255, 0, 0.3), 0 0 10px rgba(0, 255, 0, 0.5)',
  }

  return (
    <div
      className="w-screen h-screen relative flex flex-col gap-10 justify-center items-center p-10 font-display"
      style={securityCameraStyle}
    >
      {/* Background wall */}
      <img
        src="/images/wall.png"
        className="w-full h-full object-cover brightness-50 absolute inset-0"
        alt="Wall"
      />

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

      {/* Central glow effect */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-green-500 opacity-10 filter blur-xl z-10" />

      <motion.h1
        className="uppercase font-bold text-5xl text-green-500 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.7, 1, 0.7], scale: [0.95, 1, 0.95] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        DEAD LOOP
      </motion.h1>

      <motion.div
        className="flex flex-col items-center gap-5 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.h2
          className="uppercase font-bold text-green-500 border border-green-500 px-6 py-3 cursor-pointer hover:bg-green-900"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartGame}
        >
          New Game
        </motion.h2>

        <motion.div className="text-green-600 text-sm mt-4 text-center max-w-md">
          <p>A murder investigation simulator</p>
          <p>with AI-driven narrative.</p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default TitleScreen
