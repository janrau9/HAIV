import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface ChatBubbleProps {
  text: string
  speed?: number // milliseconds per character
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ text, speed = 40 }) => {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    setDisplayedText('') // Clear previous text
    let currentIndex = 0

    const interval = setInterval(() => {
      // Stop if we've reached the end
      if (currentIndex >= text.length) {
        clearInterval(interval)
        return
      }
      setDisplayedText((prev) => prev + text[currentIndex])
      currentIndex++
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed])

  return (
    <motion.div
      className="absolute top-18 left-18 transform font-bold bg-white text-black px-6 py-4 shadow-[4px_4px_0_0_black] max-w-md text-center text-lg font-mono"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {displayedText}
    </motion.div>
  )
}
