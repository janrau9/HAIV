import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import { useModal } from '../../contexts/ModalContext'
import { useGameStore } from '../../store/gameStore'
import { ChatBubble } from '../dialogue/ChatBubble'
import UserInput from '../dialogue/UserInput'
import { Background } from '../elements/Background'
import { Table } from '../elements/Table'
import { NoteBookMoadal } from '../modals/NoteBookModal'
import { Suspect } from '../suspect/Suspect'
import { SuspectInfo } from '../suspect/SuspectInfo'
import { SuspectSelection } from '../suspect/SuspectSelection'
import { SuspectSelector } from '../suspect/SuspectSelector'
import { containerVariants, itemVariants, securityCameraStyle } from '../utils/gameEffects'

interface GameScreenProps {
  suspectResponse: string
  outOfQuestions: boolean
  showQuestionsExhaustedPrompt: boolean
  showChatBubble: boolean
  showFinishConfirm: boolean
  questionsAreExhausted: boolean
  setShowChatBubble: (show: boolean) => void
  handleFinishQuestioning: () => void
  confirmFinishQuestioning: () => void
  cancelFinishQuestioning: () => void
  handleUserMessage: (message: string) => void
  handleSuspectSelect: (suspectId: string) => void
  handleMakeAccusation: (suspectIndex: number) => void
}

export const GameScreen: React.FC<GameScreenProps> = ({
  suspectResponse,
  outOfQuestions,
  showQuestionsExhaustedPrompt,
  showChatBubble,
  showFinishConfirm,
  questionsAreExhausted,
  setShowChatBubble,
  handleFinishQuestioning,
  confirmFinishQuestioning,
  cancelFinishQuestioning,
  handleUserMessage,
  handleSuspectSelect,
  handleMakeAccusation
}) => {
  const { openModal } = useModal()
  const suspects = useGameStore((state) => state.suspects)
  const currentSuspectId = useGameStore((state) => state.currentSuspectId)
  const questionCounts = useGameStore((state) => state.questionCounts)

  // Get the current suspect
  const currentSuspect =
    suspects.find((s) => s.id === currentSuspectId) || suspects[0]

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

          {/* Questions Exhausted Prompt */}
          <AnimatePresence>
            {showQuestionsExhaustedPrompt && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center z-30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-black bg-opacity-90 border-2 border-green-500 p-6 max-w-md text-green-500 font-mono"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                >
                  <h3 className="text-lg font-bold mb-4 text-center">
                    ALL QUESTIONS EXHAUSTED
                  </h3>
                  <p className="mb-2 text-center">
                    You have used all available questions.
                  </p>
                  <p className="text-center">
                    Prepare to make your final accusation.
                  </p>
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
                onSelect={handleMakeAccusation}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default GameScreen
