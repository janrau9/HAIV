import { motion } from 'framer-motion'
import React from 'react'

interface ResultProps {
  isCorrect: boolean
  suspectName: string
  onReturnToMainScreen: () => void
}

const Result: React.FC<ResultProps> = ({
  isCorrect,
  suspectName,
  onReturnToMainScreen,
}) => {
  // Messages based on result
  const getMessage = () => {
    if (isCorrect) {
      return `Congratulations, detective. Your instincts were correct. ${suspectName} was indeed the perpetrator. The evidence you uncovered was crucial to solving this case.`
    } else {
      return `I'm afraid your conclusion was incorrect, detective. ${suspectName} was not the perpetrator. The real culprit remains at large. We'll have to review the evidence more carefully next time.`
    }
  }

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
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
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
      className="w-full h-full relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Recording info header */}
      <div className="w-full flex justify-between text-green-500 font-mono text-sm p-4 absolute top-0 left-0 z-10">
        <div>REC • {currentTime}</div>
        <div>CAM-05 :: INVESTIGATION RESULT</div>
      </div>

      {/* Background wall */}
      <img
        src="/images/wall.png"
        className="w-full h-full object-cover brightness-50"
        alt="Wall"
      />

      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center"
        variants={itemVariants}
      >
        {/* Result title */}
        <motion.div
          className="bg-black bg-opacity-80 border-2 border-green-500 p-4 text-green-500 font-mono text-center mb-8 w-4/5 max-w-2xl"
          variants={itemVariants}
        >
          <h1 className="text-3xl uppercase font-bold mb-2">
            {isCorrect ? 'Case Solved' : 'Investigation Failed'}
          </h1>
          <div className="w-full h-1 bg-green-900 relative overflow-hidden mb-2">
            <div
              className="absolute h-full bg-green-500 animate-pulse"
              style={{ width: '100%' }}
            />
          </div>
        </motion.div>

        {/* Detective image */}
        <motion.div className="relative mb-8" variants={itemVariants}>
          <img
            src="/images/detective.png"
            className="max-h-[40vh] object-contain brightness-90 z-10 relative"
            alt="Detective"
          />

          {/* Spotlight effect */}
          <div className="absolute inset-0 rounded-full bg-green-500 opacity-10 filter blur-xl" />
        </motion.div>

        {/* Message box */}
        <motion.div
          className="bg-black bg-opacity-90 border-2 border-green-500 p-6 text-green-500 font-mono w-4/5 max-w-2xl"
          variants={itemVariants}
        >
          <div className="mb-6 font-terminal">
            <p className="mb-2 leading-relaxed">{getMessage()}</p>

            {!isCorrect && (
              <div className="mt-4 p-2 border border-red-500 bg-red-900 bg-opacity-20">
                <p className="text-red-400 font-bold">
                  CASE STATUS: UNRESOLVED
                </p>
              </div>
            )}

            {isCorrect && (
              <div className="mt-4 p-2 border border-green-500 bg-green-900 bg-opacity-20">
                <p className="text-green-400 font-bold">CASE STATUS: CLOSED</p>
              </div>
            )}
          </div>

          <motion.div className="flex justify-center" variants={itemVariants}>
            <motion.button
              onClick={onReturnToMainScreen}
              className="bg-black border-2 border-green-500 text-green-500 px-6 py-3 font-mono hover:bg-green-900 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              RETURN TO MAIN SCREEN
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* The animated line has been removed */}
    </motion.div>
  )
}

export default Result