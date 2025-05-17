import { create } from 'zustand'
import type { Message, SuspectProfile, Clue, Scene } from '../../types/types' // Adjust the import path as necessary

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

// const suspects = [
//   {
//     mugshot: '/images/gameBoy/suspects/suspect_1.png',
//     name: 'Suspect One',
//     guessCount: 0,
//   },
//   {
//     mugshot: '/images/gameBoy/suspects/suspect_4.png',
//     name: 'Suspect Four',
//     guessCount: 0,
//   },
//   {
//     mugshot: '/images/gameBoy/suspects/suspect_5.png',
//     name: 'Suspect Five',
//     guessCount: 0,
//   },
//   {
//     mugshot: '/images/gameBoy/suspects/suspect_2.png',
//     name: 'Suspect Two',
//     guessCount: 0,
//   },
//   // Add more suspects here
// ]

const initialSuspects: SuspectProfile[] = [
  {
    id: 'suspect_1',
    name: 'John Doe',
    personality: 'aggressive',
    secrets: ['Has a criminal record'],
    alibi: 'Was at the bar during incident',
    age: 35,
    relationships: {},
    suspicion: 0,
    trust: 0,
    guessCount: 0,
    mugshot: '/images/gameBoy/suspects/suspect_1.png',
    characteristics: ['Has a short temper', 'Often speaks in a loud voice'],
  },
  {
    id: 'suspect_2',
    name: 'Jane Smith',
    personality: 'nervous',
    secrets: ['Has a secret affair'],
    alibi: 'Was at home during incident',
    age: 28,
    relationships: {},
    suspicion: 0,
    trust: 0,
    guessCount: 0,
    mugshot: '/images/gameBoy/suspects/suspect_2.png',
    characteristics: ['Fidgets with her hands', 'Avoids eye contact'],
  },
  {
    id: 'suspect_3',
    name: 'Alice Johnson',
    personality: 'manipulative',
    secrets: ['Involved in a shady business deal'],
    alibi: 'Was at the gym during incident',
    age: 40,
    relationships: {},
    suspicion: 0,
    trust: 0,
    guessCount: 0,
    mugshot: '/images/gameBoy/suspects/suspect_3.png',
    characteristics: [
      'Speaks in a calm and collected manner',
      'Uses flattery to gain trust',
    ],
  },
  {
    id: 'suspect_4',
    name: 'Bob Brown',
    personality: 'calm',
    secrets: ['Has a hidden agenda'],
    alibi: 'Was at the library during incident',
    age: 30,
    relationships: {},
    suspicion: 0,
    trust: 0,
    guessCount: 0,
    mugshot: '/images/gameBoy/suspects/suspect_4.png',
    characteristics: [
      'Speaks slowly and deliberately',
      'Maintains a neutral expression',
    ],
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
      const suspect = state.suspects.find((s) => s.id === suspectId)
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
