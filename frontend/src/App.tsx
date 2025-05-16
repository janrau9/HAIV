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

  const [suspectResponse, setSuspectResponse] = useState('I was at home that night. You gotta believe me!');
	const [guessCount, setGuessCount] = useState(0);
	const [suspectIndex, setSuspectIndex] = useState(0);
	const [outOfQuestions, setOutOfQuestions] = useState(false);
	const guessesPerSuspect = 5;

	const suspects = [
		'/images/suspects/suspect_1.png',
		'/images/suspects/suspect_2.png'
		// Add more suspects here
	  ];

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


		if (isWsOpen.current) {
			const data = {
			  type: 'question',
			  message: message,
			}
			ws.sendMessage(data);
		  } else {
			console.error('WebSocket is not open. Message not sent:', message);
		}


		const newGuessCount = guessCount + 1;
		setGuessCount(newGuessCount);
	
		const newIndex = Math.floor(newGuessCount / guessesPerSuspect);
		if (newIndex < suspects.length) {
		  setSuspectIndex(newIndex);
		}
	
		if (newIndex == suspects.length)
		{
			setOutOfQuestions(true);
		}
		const aiResponse = `I don't know anything about "${message}" ...`;
		setSuspectResponse(aiResponse);
	  };





  return (

    <div className="w-screen h-screen relative">

      <Background></Background>
	<AnimatePresence>
	      <Suspect imgUrl={suspects[suspectIndex]} />
	</AnimatePresence>
      <div className="w-full h-full absolute top-0">
        <Table></Table>
      </div>
      <ChatBubble text={suspectResponse} />
      <UserInput onSend={handleUserMessage}></UserInput>
	<AnimatePresence>

	{outOfQuestions && (
  <SuspectSelection
    suspects={suspects}
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
