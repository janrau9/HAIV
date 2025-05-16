import {motion} from 'framer-motion'

interface ChatBubbleProps {
	text: string;
}

export const ChatBubble:React.FC<ChatBubbleProps> = ({ text }) => {
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
