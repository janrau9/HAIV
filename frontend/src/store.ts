import { create } from 'zustand'
import type { Message, SuspectProfile, Clue, Scene, Narrative, SuspectSummary } from '../../types/types' // Adjust the import path as necessary
import { Suspect } from './components/suspect/Suspect'

type GameState = {
  narrative: Narrative
  messages: Message[]
  currentSceneId: string
  currentSuspectId: string | null
  suspects: SuspectSummary[]
  scenes: Record<string, Scene>
  clues: Record<string, Clue>
  playerNotebook: string[]
  gameOver: boolean

  // Actions
  addNarrative: (narrative: Narrative) => void
  addMessage: (message: Message) => void
  setCurrentSuspect: (id: string) => void
  updateSuspect: (id: string, updates: Partial<SuspectSummary>) => void;

  markClueFound: (clueId: string) => void
  adjustSuspicion: (suspectId: string, amount: number) => void
  resetGame: () => void
}

const initialSuspects: SuspectSummary[] = [
  {
    id: 'suspect_1',
    name: 'John Doe',
    age: 32,
    occupation: 'Mechanic',
    relationship_to_victim: 'Friend',
    mugshot: '/images/gameBoy/suspects/suspect_1.png',
  },
  {
    id: 'suspect_2',
    name: 'Jane Smith',
    age: 28,
    occupation: 'Nurse',
    relationship_to_victim: 'Colleague',
    mugshot: '/images/gameBoy/suspects/suspect_2.png',
  },
  {
    id: 'suspect_3',
    name: 'Charlie Brown',
    age: 45,
    occupation: 'Teacher',
    relationship_to_victim: 'Neighbor',
    mugshot: '/images/gameBoy/suspects/suspect_3.png',
  },
  {
    id: 'suspect_4',
    name: 'Bob Brown',
    age: 40,
    occupation: 'Artist',
    relationship_to_victim: 'Stranger',
    mugshot: '/images/gameBoy/suspects/suspect_4.png',
  },
  // Add more suspects here
]

export const useGameStore = create<GameState>((set, get) => ({
  narrative: {
    detective_briefing: '',
    scene: {
      when: '',
      where: '',
      victim: {
        name: '',
        age: 0,
        description: '',
      },
    }
  },
  messages: [],
  currentSceneId: 'intro',
  currentSuspectId: null,
  suspects: initialSuspects,
  scenes: {},
  clues: {},
  playerNotebook: [],
  gameOver: false,

  addNarrative: (newNarrative) =>
    set((state) => ({
      narrative: {
        ...state.narrative,
        detective_briefing: newNarrative.detective_briefing,
        scene: newNarrative.scene,
      }
    })),

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
  updateSuspect: (id, updates) =>
    set((state) => {
      const updatedSuspects = state.suspects.map((suspect) =>
        suspect.id === id ? { ...suspect, ...updates } : suspect
      );
      return { suspects: updatedSuspects };
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
