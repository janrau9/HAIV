import React, { useState, useEffect, useRef } from 'react'
import { ChatBubble } from './components/dialogue/ChatBubble'
import UserInput from './components/dialogue/UserInput'
import { Suspect } from './components/suspect/Suspect'
import { Background } from './components/Background'
import { Table } from './components/Table'
import { useGameStore } from './store'
import { WebSocketManager } from './WebSocketManager'
import useWebsocket from './useWebsocket'



const App: React.FC = () => {

  const [suspectResponse, setSuspectResponse] = useState('');
  const {
    addMessage,
    currentSuspectId,
    suspects,
    adjustSuspicion,
  } = useGameStore.getState()
  const messages = useGameStore((state) => state.messages);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'suspect') {
      console.log('last message', lastMessage.content)
      setSuspectResponse(lastMessage.content);
    }
  }
    , [messages]);

  useWebsocket();

  const handleUserMessage = (playerInput: string) => {
    // Simulated AI response
    console.log('Player input:', playerInput)
    addMessage({
      id: crypto.randomUUID(),
      role: 'player',
      content: playerInput,
    })
  }

  return (

    <div className="w-screen h-screen relative">

      <Background></Background>
      <Suspect imgUrl='/images/suspects/suspect_1.png'></Suspect>
      <div className="w-full h-full absolute top-0">
        <Table></Table>
      </div>
      <ChatBubble text={suspectResponse} />
      <UserInput onSend={handleUserMessage}></UserInput>

    </div>
  )
}

export default App
