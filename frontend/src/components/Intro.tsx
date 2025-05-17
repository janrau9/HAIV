import { motion } from 'framer-motion'
import { TypingEffect } from './utils/TypingEffect'

interface IntroProps {
	text: string
	onComplete?: () => void
  }

export const Intro: React.FC<IntroProps> = ({text}) => {
  return (
    <motion.div className="w-full h-full">
		<TypingEffect text="Typing Effect" />
		<button>
			Investigate
		</button>
	</motion.div>
  )
}
