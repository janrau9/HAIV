import { useEffect, useRef } from 'react'
import { WebSocketManager } from './WebSocketManager'
import { useGameStore } from './store'

const useWebsocket = () => {
  const isWsOpen = useRef(false)
  const ws = WebSocketManager.getInstance()
  const messages = useGameStore((state) => state.messages)
  const { addMessage } = useGameStore.getState()

  const handleResponse = (message: any) => {
    console.log('response: ', message)
    addMessage({
      id: crypto.randomUUID(),
      role: message.role,
      content: message.content,
      suspicionChange: message.suspicionChange,
    })
    console.log('WebSocket message received:', message)
  }

  useEffect(() => {
    ws.connect()
    ws.addEventListener('response', handleResponse)
    ws.addEventListener('open', () => {
      isWsOpen.current = true
      console.log('WebSocket connection opened')
    })
    ws.addEventListener('close', () => {
      isWsOpen.current = false
      console.log('WebSocket connection closed')
    })
  }, [])

  useEffect(() => {
    if (messages.length === 0) return
    console.log('Messages changed:', messages)
    const lastMessage = messages[messages.length - 1]
    if (lastMessage.role === 'player') {
      ws.sendMessage({
        type: 'question',
        message: lastMessage,
      })
      console.log('WebSocket message sent')
    }
  }, [messages])

  useEffect(() => {
    console.log('updating messages', messages)
  }, [messages])
}

export default useWebsocket
