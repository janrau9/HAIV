import React from 'react'
import GameScreen from './components/screens/GameScreen'
import LoadingScreen from './components/screens/LoadingScreen'
import Result from './components/screens/ResultScreen'
import TitleScreen from './components/screens/TitleScreen'
import { securityCameraStyle } from './components/utils/gameEffects'
import useGameFlow from './hooks/useGameFlow'
import useWebsocket from './hooks/useWebsocket'

const App: React.FC = () => {
  const {
    suspectResponse,
    outOfQuestions,
    showQuestionsExhaustedPrompt,
    gameStart,
    showChatBubble,
    showFinishConfirm,
    isLoading,
    showResult,
    isCorrect,
    selectedSuspectName,
    questionsAreExhausted,
    
    setShowChatBubble,
    handleFinishQuestioning,
    confirmFinishQuestioning,
    cancelFinishQuestioning,
    handleReturnToMainScreen,
    handleUserMessage,
    handleSuspectSelect,
    restartGame,
    handleMakeAccusation,
  } = useGameFlow()

  // Initialize websocket connection
  useWebsocket()

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

  // Title screen
  if (!gameStart) {
    return <TitleScreen onStartGame={restartGame} />
  }

  // Loading screen while fetching narrative
  if (isLoading) {
    return <LoadingScreen />
  }

  // Main game screen
  return (
    <GameScreen
      suspectResponse={suspectResponse}
      outOfQuestions={outOfQuestions}
      showQuestionsExhaustedPrompt={showQuestionsExhaustedPrompt}
      showChatBubble={showChatBubble}
      showFinishConfirm={showFinishConfirm}
      questionsAreExhausted={questionsAreExhausted}
      setShowChatBubble={setShowChatBubble}
      handleFinishQuestioning={handleFinishQuestioning}
      confirmFinishQuestioning={confirmFinishQuestioning}
      cancelFinishQuestioning={cancelFinishQuestioning}
      handleUserMessage={handleUserMessage}
      handleSuspectSelect={handleSuspectSelect}
      handleMakeAccusation={handleMakeAccusation}
    />
  )
}

export default App
