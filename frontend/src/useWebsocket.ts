import { useEffect, useRef } from 'react'
import { WebSocketManager } from './WebSocketManager'
import { useGameStore } from './store'

const useWebsocket = () => {
  const isWsOpen = useRef(false)
  const ws = WebSocketManager.getInstance()
  const messages = useGameStore((state) => state.messages)
  const currentSuspectId = useGameStore((state) => state.currentSuspectId)
  const suspects = useGameStore((state) => state.suspects)
  const { addMessage, updateSuspectMemory, adjustSuspicion, adjustTrust, updateSuspect } = useGameStore.getState()

  const handleResponse = (message: any) => {
    console.info('handling response');

    // Add the message to the store
    addMessage({
      id: crypto.randomUUID(),
      role: message.role,
      content: message.content,
      // suspicionChange: message.suspicionChange,
      // trustChange: message.trustChange,
      suspectId: message.suspectId,
    })

    if (message.history && message.suspectId) {
      updateSuspectMemory(message.suspectId, message.history)
    }

    // // If there's a suspicion change and a suspectId, update the suspect's suspicion level
    // if (message.suspicionChange && message.suspectId) {
    //   adjustSuspicion(message.suspectId, message.suspicionChange)
    // }

    // // If there's a trust change and a suspectId, update the suspect's trust level
    // if (message.trustChange && message.suspectId) {
    //   adjustTrust(message.suspectId, message.trustChange)
    // }
  }

  const handleReveal = (message: any) => {
    console.info('revealing clue')
    // If there's a suspicion change and a suspectId, update the suspect's suspicion level
    if (message.suspectId) {
      console.info('suspicionChange')
      updateSuspect(message.suspectId, {
        suspicion: message.suspicion,
        revealedClues: [message.content],
      })
      // adjustSuspicion(message.suspectId, message.suspicionChange)
    }

    // If there's a trust change and a suspectId, update the suspect's trust level
    // if (message.trustChange && message.suspectId) {
    //   console.log('trustChange: ', message.trust)
    //   updateSuspect(message.suspectId, {
    //     trust: message.trust,
    //     revealedClues: [message.content],
    //   })
    //   // adjustTrust(message.suspectId, message.trustChange)
    // }
  }

  useEffect(() => {
    ws.connect()
    ws.addEventListener('response', handleResponse)
    ws.addEventListener('reveal', handleReveal)
    ws.addEventListener('error', (error) => {
      console.error('WebSocket error:', error)
    })
    ws.addEventListener('open', () => {
      isWsOpen.current = true
      console.info('WebSocket connection opened')
    })
    ws.addEventListener('close', () => {
      isWsOpen.current = false
      console.info('WebSocket connection closed')
    })

    // Cleanup function
    return () => {
      ws.removeEventListener('response', handleResponse)
      ws.removeEventListener('reveal', handleReveal)
      ws.removeEventListener('error', () => { })
      ws.removeEventListener('open', () => { })
      ws.removeEventListener('close', () => { })
    }
  }, [])

  useEffect(() => {
    if (messages.length === 0) return
    console.info('Messages changed');
    const lastMessage = messages[messages.length - 1]
    if (lastMessage.role === 'player') {
      ws.sendMessage({
        type: 'question',
        message: lastMessage,
        suspect: suspects.find((s) => s.id === currentSuspectId),
      })
      console.info('WebSocket message sent');
    }
  }, [messages])
}

export default useWebsocket
