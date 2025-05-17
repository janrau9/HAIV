import { motion, useInView } from 'framer-motion'
import React, { useEffect, useState, useRef } from 'react'

interface ChatBubbleProps {
  text: string
  speed?: number // milliseconds per character
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ text }) => {
  console.log(text)
  return (
    <motion.div
      className="absolute top-18 left-18 transform font-bold bg-white text-black px-6 py-4 shadow-[4px_4px_0_0_black] max-w-md text-center text-lg font-mono"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.span className="text-black">{text}</motion.span>
    </motion.div>
  )
}
