import React, { useState, useEffect, useRef } from 'react'
import { ChatBubble } from './components/dialogue/ChatBubble'
import UserInput from './components/dialogue/UserInput'
import { Suspect } from './components/suspect/Suspect'
import { Background } from './components/Background'
import { WebSocketManager } from './WebSocketManager'
import { Table } from './components/Table'


const App: React.FC = () => {

  const [suspectResponse, setSuspectResponse] = useState('I was at home that night. You gotta believe me!');
  const isWsOpen = useRef(false);
  const ws = WebSocketManager.getInstance();

  const handleResponse = (message: string) => {
    console.log("response: ", message);
    setSuspectResponse(message);
  }

  useEffect(() => {
    ws.connect();
    ws.addEventListener('response', handleResponse);
    ws.addEventListener('open', () => {
      isWsOpen.current = true;
      console.log('WebSocket connection opened');
    });
    ws.addEventListener('close', () => {
      isWsOpen.current = false;
      console.log('WebSocket connection closed');
    });
  }, []);


  const handleUserMessage = (message: string) => {
    // Simulated AI response
    if (isWsOpen.current) {
      const data = {
        type: 'question',
        message: message,
      }
      ws.sendMessage(data);
    } else {
      console.error('WebSocket is not open. Message not sent:', message);
    }
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
