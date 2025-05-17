import React, { useState, useEffect } from 'react'
import { ChatBubble } from './components/dialogue/ChatBubble'
import UserInput from './components/dialogue/UserInput'
import { Suspect } from './components/suspect/Suspect'
import { Background } from './components/Background'
import { Table } from './components/Table'
import { useGameStore } from './store'
import useWebsocket from './useWebsocket'
import { getNarrative } from './api'
import { SuspectSelection } from './components/suspect/SuspectSelection'
import { SuspectSelector } from './components/suspect/SuspectSelector'
import { SuspectInfo } from './components/suspect/SuspectInfo'
import { AnimatePresence, motion } from 'framer-motion'
import { NoteBookMoadal } from './components/modals/NoteBookModal'
import { useModal } from './contexts/ModalContext'
import { WebSocketManager } from './WebSocketManager'
import Result from './components/Result'

// Animation variants for staggered animations
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

const App: React.FC = () => {
  // State variables
  const [suspectResponse, setSuspectResponse] = useState('')
  const [outOfQuestions, setOutOfQuestions] = useState(false)
  const [gameStart, setGameStart] = useState(false)
  const [showChatBubble, setShowChatBubble] = useState(false)
  const [showFinishConfirm, setShowFinishConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  // New state variables for result screen
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [selectedSuspectName, setSelectedSuspectName] = useState('')
  const { openModal } = useModal()

  // Store functions and state
  const {
    addMessage,
    setCurrentSuspect,
    resetQuestionCounts,
    addNarrative,
    updateSuspect,
    resetGame,
  } = useGameStore.getState()

  const messages = useGameStore((state) => state.messages)
  const suspects = useGameStore((state) => state.suspects)
  const currentSuspectId = useGameStore((state) => state.currentSuspectId)
  const questionCounts = useGameStore((state) => state.questionCounts)
  const narrative = useGameStore((state) => state.narrative)

  // Helper functions for finishing questioning
  const handleFinishQuestioning = () => {
    setShowFinishConfirm(true)
  }

  const confirmFinishQuestioning = () => {
    setOutOfQuestions(true)
    setShowFinishConfirm(false)
  }

  const cancelFinishQuestioning = () => {
    setShowFinishConfirm(false)
  }

  // Handle returning to main screen from result
  const handleReturnToMainScreen = () => {
    setShowResult(false)
    setGameStart(false)
    setOutOfQuestions(false)
    resetGame() // Reset game state completely
  }

  // Security camera filter effect CSS
  const securityCameraStyle = {
    filter: 'sepia(0.3) hue-rotate(90deg) brightness(0.8) contrast(1.2)',
    boxShadow:
      'inset 0 0 30px rgba(0, 255, 0, 0.3), 0 0 10px rgba(0, 255, 0, 0.5)',
  }

  useWebsocket()

  // Custom WebSocket event handler for accusation responses
  useEffect(() => {
    const ws = WebSocketManager.getInstance()

    const handleAccusationResult = (result: any) => {
      console.log('Accusation result:', result)
      if (result.result === 'win') {
        setIsCorrect(true)
      } else {
        setIsCorrect(false)
      }
      // No need to set selectedSuspectName again as it's already set when sending the accusation
      setShowResult(true)
    }

    ws.addEventListener('accusation_result', handleAccusationResult)

    return () => {
      ws.removeEventListener('accusation_result', handleAccusationResult)
    }
  }, [])

  // Get the current suspect
  const currentSuspect =
    suspects.find((s) => s.id === currentSuspectId) || suspects[0]

  // Fetch narrative function
  const fetchNarrative = async () => {
    try {
      setIsLoading(true)
      const narrativeData = await getNarrative()
      console.log('narrative:', narrativeData)
			addNarrative(narrativeData)

      suspects.forEach((suspect, index) => {
        if (narrativeData.suspects[index]?.summary) {
          updateSuspect(suspect.id, narrativeData.suspects[index].summary)
        }
      })
    } catch (error) {
      console.error('Error fetching narrative:', error)
      // Handle error
    } finally {
      setIsLoading(false)
    }
  }

  // Effect to handle suspect responses
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage && lastMessage.role === 'suspect') {
      // Remove any 'undefined' strings that might appear in the response
      const cleanResponse = lastMessage.content.replace('undefined', '')
      setSuspectResponse(cleanResponse)
      setShowChatBubble(true)
    }
  }, [messages])

  // Effect to check if all questions are used
  useEffect(() => {
    const allQuestionsUsed = Object.values(questionCounts).every(
      (count) => count <= 0,
    )
    if (allQuestionsUsed) {
      setOutOfQuestions(true)
    }
  }, [questionCounts])

  // Effect to fetch narrative when game starts
  useEffect(() => {
    if (!gameStart) return
    fetchNarrative()
  }, [gameStart])

  // Logging effects
  useEffect(() => {
    console.log('narrative:', narrative)
  }, [narrative])

  useEffect(() => {
    console.log('suspects:', suspects)
  }, [suspects])

  // Handle user messages
  const handleUserMessage = (playerInput: string) => {
    console.log('Player input:', playerInput)
    addMessage({
      id: crypto.randomUUID(),
      role: 'player',
      content: playerInput,
    })
  }

  // Handle suspect selection
  const handleSuspectSelect = (suspectId: string) => {
    // Only allow selection if the suspect has questions remaining
    if (questionCounts[suspectId] > 0) {
      setCurrentSuspect(suspectId)
    }
  }

  // Start new game
  const restartGame = () => {
    setGameStart(true)
    setOutOfQuestions(false)
    resetQuestionCounts()
  }

  // Title screen
  if (!gameStart) {
    return (
      <div
        className="w-screen h-screen bg-black gap-2 relative flex flex-col gap-10 justify-center items-center p-10 font-display"
        style={securityCameraStyle}
      >
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

        <motion.h1
          className="uppercase font-bold text-5xl text-green-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.7, 1, 0.7], scale: [0.95, 1, 0.95] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          Dead Loop
        </motion.h1>

        <motion.div
          className="flex flex-col items-center gap-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.h2
            className="uppercase font-bold text-green-500 border border-green-500 px-6 py-3 cursor-pointer hover:bg-green-900"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={restartGame}
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

  // Show result screen if a final suspect was selected
  if (showResult) {
    return (
      <div style={securityCameraStyle} className="w-screen h-screen">
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

        <Result
          isCorrect={isCorrect}
          suspectName={selectedSuspectName}
          onReturnToMainScreen={handleReturnToMainScreen}
        />
      </div>
    )
  }

  // Show loading screen while fetching narrative
  if (isLoading) {
    return (
      <div
        className="w-screen h-screen flex justify-center items-center bg-black"
        style={securityCameraStyle}
      >
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

        <div className="flex flex-col items-center">
          <div className="text-green-500 font-mono text-xl animate-pulse mb-4">
            GENERATING CASE FILE...
          </div>
          <div className="w-32 h-1 bg-green-900 relative overflow-hidden">
            <div
              className="absolute h-full bg-green-500 animate-[loading_1.5s_ease-in-out_infinite]"
              style={{ width: '30%' }}
            />
          </div>
        </div>
      </div>
    )
  }

  // Main game screen
  return (
    <div className="w-screen h-screen relative">
      <NoteBookMoadal />
      <motion.div
        className="w-screen h-screen bg-black-custom relative flex flex-col justify-center items-center p-10"
        style={securityCameraStyle}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
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

        {/* Camera interface elements */}
        <div className="absolute top-5 left-5 text-green-500 font-mono text-xs">
          REC ● {new Date().toLocaleTimeString()}
        </div>

        <div className="absolute top-5 right-5 text-green-500 font-mono text-xs">
          CAM-01 :: INTERROGATION
        </div>

        {/* Main content area */}
        <motion.div
          className="w-[80%] relative border border-green-500 overflow-hidden mb-4"
          variants={itemVariants}
        >
          <Background />
          <AnimatePresence mode="wait">
            <Suspect imgUrl={currentSuspect?.mugshot || ''} />
          </AnimatePresence>

          <div className="w-full h-full absolute top-0">
            <Table />
          </div>

          {/* Finish Questioning button - repositioned to bottom center */}
          <button
            onClick={handleFinishQuestioning}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black border-2 border-green-500 text-green-500 px-4 py-2 font-mono hover:bg-green-900 transition-colors z-20"
          >
            FINISH QUESTIONING
          </button>

          {/* Notes button at bottom right */}
          <button
            onClick={() => openModal('noteBook')}
            className="absolute bottom-4 right-4 bg-black border border-green-500 p-2 hover:bg-green-900 z-10"
          >
            <img
              className="w-10 h-10 invert sepia hue-rotate-90"
              src="/images/gameBoy/notes.png"
              alt="Notes"
            />
          </button>

          <AnimatePresence mode="wait">
            {showChatBubble && (
              <ChatBubble
                text={suspectResponse}
                onComplete={() => setShowChatBubble(false)}
              />
            )}
          </AnimatePresence>

          {/* Confirmation dialog - positioned to show suspect */}
          <AnimatePresence>
            {showFinishConfirm && (
              <motion.div
                className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <motion.div
                  className="bg-black bg-opacity-90 border-2 border-green-500 p-6 max-w-md text-green-500 font-mono"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                >
                  <h3 className="text-lg font-bold mb-4">
                    Confirm End Investigation
                  </h3>
                  <p className="mb-6">
                    Are you ready to make your final accusation? This will end
                    the questioning phase.
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={cancelFinishQuestioning}
                      className="border border-green-500 px-4 py-2 hover:bg-red-900"
                    >
                      CANCEL
                    </button>
                    <button
                      onClick={confirmFinishQuestioning}
                      className="border border-green-500 px-4 py-2 hover:bg-green-900"
                    >
                      CONFIRM
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Bottom input area with grid layout */}
        <motion.div className="w-[80%] flex gap-4" variants={itemVariants}>
          {/* Left side - Suspect info */}
          <div className="w-1/3">
            <SuspectInfo />
          </div>

          {/* Middle - Input field */}
          <div className="w-1/3">
            <UserInput
              onSend={handleUserMessage}
              disabled={questionCounts[currentSuspectId || ''] <= 0}
            />
          </div>

          {/* Right side - Suspect selector grid */}
          <div className="w-1/3">
            <SuspectSelector onSelect={handleSuspectSelect} />
          </div>
        </motion.div>

        {/* Final suspect selection modal */}
        <AnimatePresence>
          {outOfQuestions && (
            <motion.div
              className="absolute inset-0 z-40 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SuspectSelection
                suspects={suspects}
                onSelect={(index) => {
                  // Get the selected suspect
                  const selectedSuspect = suspects[index]

                  // Send accusation via websocket
                  const ws = WebSocketManager.getInstance()
                  ws.sendMessage({
                    type: 'accusation',
                    suspectId: selectedSuspect.id,
                  })

                  ws.addEventListener('accusation_result', (result: any) => {
                    console.log('Accusation result:', result)
                    if (result.result === 'win') {
                      setIsCorrect(true)
                    } else {
                      setIsCorrect(false)
                    }
                    setShowResult(true)
                  })
                  // For now, we'll just simulate the accusation result

                  // For now, we'll determine correctness based on suspicion level
                  // In a full implementation, the backend would tell us if we're correct
                  // const suspectWithHighestSuspicion = [...suspects].sort(
                  //   (a, b) => (b.suspicion || 0) - (a.suspicion || 0),
                  // )[0]

                  // // Set state for the result screen
                  // const isCorrect =
                  //   selectedSuspect.id === suspectWithHighestSuspicion?.id
                  // setIsCorrect(isCorrect)
                  setSelectedSuspectName(selectedSuspect.name)
                  setShowResult(true)
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default App
