import { useEffect, useState } from 'react'
import { WebSocketManager } from '../services/WebSocketManager'
import { getNarrative } from '../services/api'
import { useGameStore } from '../store/gameStore'

export const useGameFlow = () => {
  // State variables
  const [suspectResponse, setSuspectResponse] = useState('')
  const [outOfQuestions, setOutOfQuestions] = useState(false)
  const [showQuestionsExhaustedPrompt, setShowQuestionsExhaustedPrompt] = useState(false)
  const [gameStart, setGameStart] = useState(false)
  const [showChatBubble, setShowChatBubble] = useState(false)
  const [showFinishConfirm, setShowFinishConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [selectedSuspectName, setSelectedSuspectName] = useState('')
  const [questionsAreExhausted, setQuestionsAreExhausted] = useState(false)

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

  // Helper functions for finishing questioning
  const handleFinishQuestioning = () => {
    setShowFinishConfirm(true)
  }

  const confirmFinishQuestioning = () => {
    // Skip showing "questions exhausted" prompt when manually finishing
    // Go directly to suspect selection after a brief delay
    setTimeout(() => {
      setOutOfQuestions(true)
    }, 1000)
    
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
    setQuestionsAreExhausted(false)
    resetGame()
  }

  // Fetch narrative function
  const fetchNarrative = async () => {
    try {
      setIsLoading(true)
      const narrativeData = await getNarrative()
      console.info('narrative fetched')
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

  // Handle user messages
  const handleUserMessage = (playerInput: string) => {
    console.info('Player input:', playerInput)
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
    setQuestionsAreExhausted(false)
    resetQuestionCounts()
  }

  // Handle final accusation
  const handleMakeAccusation = (suspectIndex: number) => {
    // Get the selected suspect
    const selectedSuspect = suspects[suspectIndex]

    // Send accusation via websocket
    const ws = WebSocketManager.getInstance()
    ws.sendMessage({
      type: 'accusation',
      suspectId: selectedSuspect.id,
    })

    setSelectedSuspectName(selectedSuspect.name)
  }

  // Setup WebSocket accusation result listener
  useEffect(() => {
    const ws = WebSocketManager.getInstance()

    const handleAccusationResult = (result: any) => {
      console.log('Accusation result:', result)
      if (result.result === 'win') {
        setIsCorrect(true)
      } else {
        setIsCorrect(false)
      }
      setShowResult(true)
    }

    ws.addEventListener('accusation_result', handleAccusationResult)

    return () => {
      ws.removeEventListener('accusation_result', handleAccusationResult)
    }
  }, [])

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
    if (allQuestionsUsed && !outOfQuestions && !questionsAreExhausted) {
      setQuestionsAreExhausted(true)
    }
  }, [questionCounts, outOfQuestions, questionsAreExhausted])

  // Show the prompt after chat bubble disappears
  useEffect(() => {
    if (questionsAreExhausted && !showChatBubble && !showQuestionsExhaustedPrompt) {
      setShowQuestionsExhaustedPrompt(true)

      // After 5 seconds, show the suspect selection screen
      setTimeout(() => {
        setOutOfQuestions(true)
        setShowQuestionsExhaustedPrompt(false)
      }, 5000)
    }
  }, [questionsAreExhausted, showChatBubble, showQuestionsExhaustedPrompt])

  // Effect to fetch narrative when game starts
  useEffect(() => {
    if (!gameStart) return
    fetchNarrative()
  }, [gameStart])

  return {
    // States
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
    
    // Functions
    setShowChatBubble,
    handleFinishQuestioning,
    confirmFinishQuestioning,
    cancelFinishQuestioning,
    handleReturnToMainScreen,
    handleUserMessage,
    handleSuspectSelect,
    restartGame,
    handleMakeAccusation,
    
    // Store data
    messages,
    suspects,
    currentSuspectId,
    questionCounts
  }
}

export default useGameFlow
