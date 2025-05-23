import { motion } from 'framer-motion'
import { TypingEffect } from '../utils/TypingEffect'

// THIS IS CURRENTLY NOT USED!!

interface IntroProps {
  text: string
  onComplete?: () => void
}

export const Intro: React.FC<IntroProps> = () => {
  return (
    <motion.div className="w-full h-full">
      <TypingEffect text="Typing Effect" />
      <button>Investigate</button>
    </motion.div>
  )
}
