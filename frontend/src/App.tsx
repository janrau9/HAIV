import React, {useState, useEffect} from 'react'
import { motion } from 'framer-motion'
import { ChatBubble } from './components/dialogue/ChatBubble'
import UserInput from './components/dialogue/UserInput'
import { Suspect } from './components/suspect/Suspect'
import { Background } from './components/Background'
import { Table } from './components/Table'


const App: React.FC = () => {

	const [suspectResponse, setSuspectResponse] = useState('I was at home that night. You gotta believe me!');

	const handleUserMessage = (message: string) => {
	  // Simulated AI response
	  const aiResponse = `I dont know anything about "${message}" ...`;
	  setSuspectResponse(aiResponse);

	}


  return (

	<div className="w-screen h-screen relative overflow-hidden">

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
