import React, { useState, useEffect, useRef } from 'react'
import { ChatBubble } from './components/dialogue/ChatBubble'
import UserInput from './components/dialogue/UserInput'
import { Suspect } from './components/suspect/Suspect'
import { Background } from './components/Background'
import { Table } from './components/Table'
import { useGameStore } from './store'
import useWebsocket from './useWebsocket'

import { SuspectSelection } from './components/suspect/SuspectSelection'
import { AnimatePresence } from 'framer-motion'


const App: React.FC = () => {

  const [suspectResponse, setSuspectResponse] = useState('');
  const {
    addMessage,
    currentSuspectId,
    // suspects,
    adjustSuspicion,
  } = useGameStore.getState()
  const messages = useGameStore((state) => state.messages);
  const suspects = useGameStore((state) => state.suspects);


  const [guessCount, setGuessCount] = useState(0);
  const [suspectIndex, setSuspectIndex] = useState(0);
  const [outOfQuestions, setOutOfQuestions] = useState(false);
  const guessesPerSuspect = 5;

  // const suspects = [
  //   '/images/suspects/suspect_1.png',
  //   '/images/suspects/suspect_2.png'
  //   // Add more suspects here
  // ];

  useWebsocket();

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'suspect') {
      console.log('last message', lastMessage.content)
      setSuspectResponse(lastMessage.content);
    }
  }
    , [messages]);

  const handleUserMessage = (playerInput: string) => {
    // Simulated AI response
    console.log('Player input:', playerInput)
    addMessage({
      id: crypto.randomUUID(),
      role: 'player',
      content: playerInput,
    })

    const newGuessCount = guessCount + 1;
    setGuessCount(newGuessCount);

    const newIndex = Math.floor(newGuessCount / guessesPerSuspect);
    if (newIndex < suspects.length) {
      setSuspectIndex(newIndex);
    }

    if (newIndex == suspects.length) {
      setOutOfQuestions(true);
    }
  };

  return (

    <div className="w-screen h-screen relative">

      <Background></Background>
      <AnimatePresence>
        <Suspect imgUrl={suspects[suspectIndex].url} />
      </AnimatePresence>
      <div className="w-full h-full absolute top-0">
        <Table></Table>
      </div>
      <ChatBubble text={suspectResponse} />
      <UserInput onSend={handleUserMessage}></UserInput>
      <AnimatePresence>

        {outOfQuestions && (
          <SuspectSelection
            suspects={suspects.map((suspect) => suspect.url)}
            onSelect={(index) => {
              alert(`You selected Suspect #${index + 1}`);
              // You can handle logic here (like showing result or resetting)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
