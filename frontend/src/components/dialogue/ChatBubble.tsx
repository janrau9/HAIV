import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'

interface ChatBubbleProps {
  text: string
  speed?: number // milliseconds per character
  onComplete?: () => void // Called after full text + delay
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  text,
  speed = 30,
  onComplete,
}) => {
  const [displayedText, setDisplayedText] = useState('')
  const [typingDone, setTypingDone] = useState(false)

  useEffect(() => {
    setDisplayedText('')
    setTypingDone(false)
    let currentIndex = 0

    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText((prev) => prev + text.charAt(currentIndex))
        currentIndex++
      } else {
        clearInterval(interval)
        setTypingDone(true)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed])

  useEffect(() => {
    if (!typingDone) return

    const timeout = setTimeout(() => {
      onComplete?.()
    }, 6000)

    return () => {
      clearTimeout(timeout)
      setTypingDone(false)
    }
  }, [typingDone])

  return (
    <motion.div
      className="absolute top-18 left-18 transform font-bold bg-white text-black px-6 py-4 shadow-[4px_4px_0_0_black] max-w-md text-center text-lg font-mono"
      key={text}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.span className="text-black whitespace-pre-wrap">
        {displayedText}
      </motion.span>
    </motion.div>
  )
}
