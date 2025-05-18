import { motion } from 'framer-motion'
import React, { useEffect, useState, useRef } from 'react'

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
  const textRef = useRef(text)

  // Update the ref when text changes
  useEffect(() => {
    textRef.current = text
  }, [text])

  useEffect(() => {
    setDisplayedText('')
    setTypingDone(false)

    let currentIndex = 0
    const cleanText = textRef.current.replace('undefined', '') // Remove any 'undefined' strings

    const typeNextChar = () => {
      if (currentIndex < cleanText.length) {
        // Add one character at a time to the displayed text
        setDisplayedText(cleanText.substring(0, currentIndex + 1))
        currentIndex++
        setTimeout(typeNextChar, speed)
      } else {
        setTypingDone(true)
      }
    }

    // Start typing
    typeNextChar()

    // Cleanup
    return () => {
      setDisplayedText('')
    }
  }, [text, speed])

  useEffect(() => {
    if (!typingDone) return

    const timeout = setTimeout(() => {
      onComplete?.()
    }, 6000)

    return () => {
      clearTimeout(timeout)
    }
  }, [typingDone, onComplete])

  return (
    <motion.div
      // Positioned to the left side of the suspect (where the red area was marked)
      className="absolute top-20 left-10 max-w-[40%] z-30 font-mono"
      key={text}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Chat bubble with triangle pointer */}
      <div className="relative bg-white text-black px-6 py-4 rounded-lg shadow-md">
        {/* Triangle pointer on the right side of the bubble */}
        <div
          className="absolute right-0 top-1/2 transform translate-x-4 -translate-y-1/2 w-0 h-0 
                      border-t-[10px] border-t-transparent 
                      border-l-[16px] border-l-white 
                      border-b-[10px] border-b-transparent"
        />

        <motion.p className="text-black whitespace-pre-wrap text-sm md:text-base">
          {displayedText}
        </motion.p>

        {/* Typing indicator */}
        {!typingDone && (
          <div className="flex mt-1 space-x-1">
            <motion.div
              className="w-2 h-2 bg-gray-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
            <motion.div
              className="w-2 h-2 bg-gray-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
            />
            <motion.div
              className="w-2 h-2 bg-gray-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
            />
          </div>
        )}
      </div>
    </motion.div>
  )
}
