import React, { useState, useEffect, useRef } from 'react'
import { ChatBubble } from './components/dialogue/ChatBubble'
import UserInput from './components/dialogue/UserInput'
import { Suspect } from './components/suspect/Suspect'
import { Background } from './components/Background'
import { WebSocketManager } from './WebSocketManager'
import { Table } from './components/Table'
import { SuspectSelection } from './components/suspect/SuspectSelection'
import { AnimatePresence } from 'framer-motion'

const App: React.FC = () => {
  const [suspectResponse, setSuspectResponse] = useState(
    'I was at home that night. You gotta believe me!',
  )
  const [guessCount, setGuessCount] = useState(0)
  const [suspectIndex, setSuspectIndex] = useState(0)
  const [outOfQuestions, setOutOfQuestions] = useState(false)
  const [selectedSuspect, setSelectedSuspect] = useState()
  const guessesPerSuspect = 5

  const suspects = [
    {
      mugshot: '/images/gameBoy/suspects/suspect_1.png',
      name: 'Suspect One',
      guessCount: 0,
    },
    {
      mugshot: '/images/gameBoy/suspects/suspect_4.png',
      name: 'Suspect Four',
      guessCount: 0,
    },
    {
      mugshot: '/images/gameBoy/suspects/suspect_5.png',
      name: 'Suspect Five',
      guessCount: 0,
    },
    {
      mugshot: '/images/gameBoy/suspects/suspect_2.png',
      name: 'Suspect Two',
      guessCount: 0,
    },
    // Add more suspects here
  ]

  const isWsOpen = useRef(false)
  const ws = WebSocketManager.getInstance()

  const handleResponse = (message: string) => {
    console.log('response: ', message)
    setSuspectResponse(message)
  }

  useEffect(() => {
    ws.connect()
    ws.addEventListener('response', handleResponse)
    ws.addEventListener('open', () => {
      isWsOpen.current = true
      console.log('WebSocket connection opened')
    })
    ws.addEventListener('close', () => {
      isWsOpen.current = false
      console.log('WebSocket connection closed')
    })
  }, [])

  const handleUserMessage = (message: string) => {
    if (isWsOpen.current) {
      const data = {
        type: 'question',
        message: message,
      }
      ws.sendMessage(data)
    } else {
      console.error('WebSocket is not open. Message not sent:', message)
    }

    const newGuessCount = guessCount + 1
    setGuessCount(newGuessCount)

    const newIndex = Math.floor(newGuessCount / guessesPerSuspect)
    if (newIndex < suspects.length) {
      setSuspectIndex(newIndex)
    }

    if (newIndex == suspects.length) {
      setOutOfQuestions(true)
    }
    const aiResponse = `I don't know anything about "${message}" ...`
    setSuspectResponse(aiResponse)
  }

  return (
    <div className="w-screen h-screen bg-black gap-2 relative flex flex-col justify-center items-center p-10">
      <div className="w-[80%] relative border-white border-1 overflow-hidden">
        <Background></Background>
        <AnimatePresence>
          <Suspect imgUrl={suspects[suspectIndex].mugshot} />
        </AnimatePresence>
        <div className="w-full h-full absolute top-0 ">
          <Table></Table>
        </div>
        <ChatBubble text={suspectResponse} />
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
              // You can handle logic here (like showing result or resetting)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
