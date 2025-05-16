import { motion } from 'framer-motion'

const DialogueBox = ({ text }) => {
	return (
	  <motion.div
		className="absolute top-24 left-24 transform bg-white text-black px-6 py-4 shadow-[4px_4px_0_0_black] max-w-md text-center text-lg font-mono"
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
	  >
		{text}
	  </motion.div>
	);
  };

function App() {
  return (

	<div className="w-screen h-screen relative">

    <motion.div
	className='bg-black w-screen h-screen object-contain'
    >
		<img src="/images/wall.png" className="w-full h-full"></img>
    </motion.div>
	<motion.img
  className="absolute bottom-0 left-1/2 max-h-[60%] "
  src="/images/suspects/suspect_1.png"
  animate={{
    y: [0, -5, 0], // Moves up 10px then back down
  }}
  transition={{
    duration: 3,
    repeat: Infinity,
    repeatType: "loop",
    ease: "easeInOut",
  }}
/>
<DialogueBox text="I was at home that night. You gotta believe me!" />

	</div>
  )
}

export default App
