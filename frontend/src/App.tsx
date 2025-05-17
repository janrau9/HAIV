import React, { useState, useEffect } from 'react'
import { ChatBubble } from './components/dialogue/ChatBubble'
import UserInput from './components/dialogue/UserInput'
import { Suspect } from './components/suspect/Suspect'
import { Background } from './components/Background'
import { Table } from './components/Table'
import { useGameStore } from './store'
import useWebsocket from './useWebsocket'
import { SuspectSelection } from './components/suspect/SuspectSelection'
import { SuspectSelector } from './components/suspect/SuspectSelector'
import { SuspectInfo } from './components/suspect/SuspectInfo'
import { AnimatePresence, motion } from 'framer-motion'
import { NoteBookMoadal } from './components/modals/NoteBookModal'
import { useModal } from './contexts/ModalContext'

const App: React.FC = () => {
  const [suspectResponse, setSuspectResponse] = useState('')
  const { addMessage, setCurrentSuspect, resetQuestionCounts } =
    useGameStore.getState()
  const messages = useGameStore((state) => state.messages)
  const suspects = useGameStore((state) => state.suspects)
  const currentSuspectId = useGameStore((state) => state.currentSuspectId)
  const questionCounts = useGameStore((state) => state.questionCounts)

  const [outOfQuestions, setOutOfQuestions] = useState(false)
  const [gameStart, setGameStart] = useState(false)
  const [showChatBubble, setShowChatBubble] = useState(false)
  const [showFinishConfirm, setShowFinishConfirm] = useState(false)
  const { openModal } = useModal()

  // Define the missing handler functions
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

  // Security camera filter effect CSS
  const securityCameraStyle = {
    filter: 'sepia(0.3) hue-rotate(90deg) brightness(0.8) contrast(1.2)',
    boxShadow:
      'inset 0 0 30px rgba(0, 255, 0, 0.3), 0 0 10px rgba(0, 255, 0, 0.5)',
  }

  useWebsocket()

  // Get the current suspect
  const currentSuspect =
    suspects.find((s) => s.id === currentSuspectId) || suspects[0]

  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage && lastMessage.role === 'suspect') {
      setSuspectResponse(lastMessage.content)
      setShowChatBubble(true)
    }
  }, [messages])

  useEffect(() => {
    // Check if all suspects are out of questions
    const allQuestionsUsed = Object.values(questionCounts).every(
      (count) => count <= 0,
    )
    if (allQuestionsUsed) {
      setOutOfQuestions(true)
    }
  }, [questionCounts])

  const handleUserMessage = (playerInput: string) => {
    console.log('Player input:', playerInput)
    addMessage({
      id: crypto.randomUUID(),
      role: 'player',
      content: playerInput,
    })
  }

  const handleSuspectSelect = (suspectId: string) => {
    // Only allow selection if the suspect has questions remaining
    if (questionCounts[suspectId] > 0) {
      setCurrentSuspect(suspectId)
    }
  }

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

  return (
    <div
      className="w-screen h-screen bg-black-custom relative flex flex-col justify-center items-center p-10"
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

      {/* Camera interface elements */}
      <div className="absolute top-5 left-5 text-green-500 font-mono text-xs">
        REC ● {new Date().toLocaleTimeString()}
      </div>

      <div className="absolute top-5 right-5 text-green-500 font-mono text-xs">
        CAM-01 :: INTERROGATION
      </div>

      {/* Main content area */}
      <div className="w-[80%] relative border border-green-500 overflow-hidden mb-4">
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

        {/* Confirmation dialog */}
        {showFinishConfirm && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-30">
            <div className="bg-black border-2 border-green-500 p-6 max-w-md text-green-500 font-mono">
              <h3 className="text-lg font-bold mb-4">
                Confirm End Investigation
              </h3>
              <p className="mb-6">
                Are you ready to make your final accusation? This will end the
                questioning phase.
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
            </div>
          </div>
        )}

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
      </div>

      {/* Bottom input area with grid layout */}
      <div className="w-[80%] flex gap-4">
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
      </div>

      {/* Final suspect selection modal */}
      <AnimatePresence>
        {outOfQuestions && (
          <SuspectSelection
            suspects={suspects}
            onSelect={(index) => {
              alert(`You selected ${suspects[index].name} as the murderer!`)
              setGameStart(false)
              setOutOfQuestions(false)
            }}
          />
        )}
      </AnimatePresence>

      <NoteBookMoadal />
    </div>
  )
}

export default App
