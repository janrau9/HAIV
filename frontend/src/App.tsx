import React, { useState, useEffect, useRef } from 'react'
import { ChatBubble } from './components/dialogue/ChatBubble'
import UserInput from './components/dialogue/UserInput'
import { Suspect } from './components/suspect/Suspect'
import { Background } from './components/Background'
import { Table } from './components/Table'
import { useGameStore } from './store'
import useWebsocket from './useWebsocket'
import { WebSocketManager } from './WebSocketManager'

import { SuspectSelection } from './components/suspect/SuspectSelection'
import { AnimatePresence } from 'framer-motion'

const App: React.FC = () => {
  const [suspectResponse, setSuspectResponse] = useState('')
  const {
    addMessage,
    currentSuspectId,
    // suspects,
    adjustSuspicion,
    setCurrentSuspect,
  } = useGameStore.getState()
  const messages = useGameStore((state) => state.messages)
  const suspects = useGameStore((state) => state.suspects)

  const [guessCount, setGuessCount] = useState(0)
  const [suspectIndex, setSuspectIndex] = useState(0)
  const [outOfQuestions, setOutOfQuestions] = useState(false)
  const [gameStart, setGameStart] = useState(false)
  const [showChatBubble, setShowChatBubble] = useState(false)

  const guessesPerSuspect = 5

  useWebsocket()

  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage && lastMessage.role === 'suspect') {
      console.log('last message', lastMessage.content)
      setSuspectResponse(lastMessage.content)
      setShowChatBubble(true)
    }
  }, [messages])

  if (!gameStart) {
    return (
      <div className="w-screen h-screen bg-black gap-2 relative flex flex-col gap-10 justify-center items-center p-10 font-display">
        <h1 className="uppercase font-bold text-5xl">Dead Loop</h1>
        <h2 className="uppercase font-bold" onClick={() => setGameStart(true)}>
          New Game
        </h2>
      </div>
    )
  }
  const handleUserMessage = (playerInput: string) => {
    console.log('Player input:', playerInput)
    addMessage({
      id: crypto.randomUUID(),
      role: 'player',
      content: playerInput,
    })

    const newGuessCount = guessCount + 1
    setGuessCount(newGuessCount)

    const newIndex = Math.floor(newGuessCount / guessesPerSuspect)
    setCurrentSuspect(suspects[newIndex].id)
    if (newIndex < suspects.length) {
      setSuspectIndex(newIndex)
    }

    if (newIndex == suspects.length) {
      setOutOfQuestions(true)
    }

    const timer = setTimeout(() => {
      setShowChatBubble(false)
    }, 3000) // Chat bubble disappears after 3 seconds

    return () => clearTimeout(timer) // Clear timeout on re-render
  }

  return (
    <div className="w-screen h-screen bg-black-custom gap-2 relative flex flex-col justify-center items-center p-10 ">
      <div className="w-[80%] relative border-white border-1 overflow-hidden">
        <Background></Background>
        <AnimatePresence>
          <Suspect imgUrl={suspects[suspectIndex].mugshot} />
        </AnimatePresence>
        <div className="w-full h-full absolute top-0 ">
          <Table></Table>
        </div>
        <AnimatePresence mode="wait">
          {showChatBubble && (
            <ChatBubble
              text={suspectResponse}
              onComplete={() => setShowChatBubble(false)}
            />
          )}
        </AnimatePresence>
      </div>
      <div className="w-[80%] flex justify-between">
        <UserInput onSend={handleUserMessage}></UserInput>
        <img className="w-12 h-12" src="/images/gameBoy/notes.png"></img>
      </div>
      <AnimatePresence>
        {outOfQuestions && (
          <SuspectSelection
            suspects={suspects}
            onSelect={(index) => {
              alert(`You selected Suspect #${index + 1}`)
              setGameStart(false)
              setGuessCount(0)
              setOutOfQuestions(false)
              setSuspectIndex(0)
              // You can handle logic here (like showing result or resetting)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
