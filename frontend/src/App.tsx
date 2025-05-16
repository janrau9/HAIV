import React, {useState, useEffect} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChatBubble } from './components/dialogue/ChatBubble'
import UserInput from './components/dialogue/UserInput'
import { Suspect } from './components/suspect/Suspect'
import { Background } from './components/Background'
import { Table } from './components/Table'
import { SuspectSelection } from './components/suspect/SuspectSelection'


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


	  const handleUserMessage = (message: string) => {
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

	<div className="w-screen h-screen relative overflow-hidden">

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
