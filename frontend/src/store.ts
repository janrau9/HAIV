import { create } from 'zustand'

export type Role = 'player' | 'suspect' | 'narrator' | 'system'

export type Message = {
  id: string
  role: Role
  speakerId?: string
  content: string
  emotion?: string
  sceneId?: string
  suspicionChange?: number
  tags?: string[]
  timestamp?: number
}

export type SuspectProfile = {
  id: string
  name: string
  personality: 'aggressive' | 'nervous' | 'manipulative' | 'calm'
  secrets: string[]
  alibi: string
  relationships: Record<string, string>
  suspicion: number
  trust: number
  url: string
}

export type Clue = {
  id: string
  content: string
  foundInSceneId: string
  discovered: boolean
}

export type Scene = {
  id: string
  name: string
  isLocked: boolean
  suspects: string[] // suspect IDs
  clueIds: string[]
}

type GameState = {
  messages: Message[]
  currentSceneId: string
  currentSuspectId: string | null
  suspects: SuspectProfile[]
  scenes: Record<string, Scene>
  clues: Record<string, Clue>
  playerNotebook: string[]
  gameOver: boolean

  // Actions
  addMessage: (message: Message) => void
  setCurrentSuspect: (id: string) => void
  markClueFound: (clueId: string) => void
  adjustSuspicion: (suspectId: string, amount: number) => void
  resetGame: () => void
}

const initialSuspects: SuspectProfile[] = [
  {
    id: 'suspect_1',
    name: 'John Doe',
    personality: 'aggressive',
    secrets: ['Has a criminal record'],
    alibi: 'Was at the bar during incident',
    relationships: {},
    suspicion: 0,
    trust: 0,
    url: '/images/suspects/suspect_1.png',
  },
  {
    id: 'suspect_2',
    name: 'Jane Smith',
    personality: 'nervous',
    secrets: ['Has a secret affair'],
    alibi: 'Was at home during incident',
    relationships: {},
    suspicion: 0,
    trust: 0,
    url: '/images/suspects/suspect_2.png',
  },
  // Add more suspects here
]

export const useGameStore = create<GameState>((set, get) => ({
  messages: [],
  currentSceneId: 'intro',
  currentSuspectId: null,
  suspects: initialSuspects,
  scenes: {},
  clues: {},
  playerNotebook: [],
  gameOver: false,

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, { ...message, timestamp: Date.now() }],
    })),

  setCurrentSuspect: (id) => set({ currentSuspectId: id }),

  markClueFound: (clueId) =>
    set((state) => ({
      clues: {
        ...state.clues,
        [clueId]: { ...state.clues[clueId], discovered: true },
      },
      playerNotebook: [...state.playerNotebook, clueId],
    })),

  adjustSuspicion: (suspectId, amount) =>
    set((state) => {
      const suspect = state.suspects[suspectId]
      if (!suspect) return {}
      return {
        suspects: {
          ...state.suspects,
          [suspectId]: {
            ...suspect,
            suspicion: Math.max(0, suspect.suspicion + amount),
          },
        },
      }
    }),

  resetGame: () =>
    set({
      messages: [],
      currentSceneId: 'intro',
      currentSuspectId: null,
      playerNotebook: [],
      gameOver: false,
    }),
}))
