import { create } from 'zustand'
import type {
  Clue,
  Message,
  Narrative,
  Scene,
  SuspectSummary,
} from '../../types/types' // Adjust the import path as necessary
import type { ChatResponse } from '../../backend/src/aiService'
import { Suspect } from './components/suspect/Suspect'

// New interface for managing question counts
interface QuestionCounts {
  [suspectId: string]: number
}

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
  questionCounts: QuestionCounts // New field to track question counts

  // Actions
  addNarrative: (narrative: Narrative) => void
  addMessage: (message: Message) => void
  setCurrentSuspect: (id: string) => void
  updateSuspect: (id: string, updates: Partial<SuspectSummary>) => void

  markClueFound: (clueId: string) => void
  adjustSuspicion: (suspectId: string, amount: number) => void
  resetGame: () => void
  decrementQuestionCount: (suspectId: string) => void
  resetQuestionCounts: () => void
  updateSuspectMemory: (id: string, history: ChatResponse[]) => void
}

const initialSuspects: SuspectSummary[] = [
  {
    id: 'Suspect_1',
    name: 'John Doe',
    age: 32,
    occupation: 'Mechanic',
    relationship_to_victim: 'Friend',
    known_interactions: 'Met victim last week',
    mugshot: '/images/gameBoy/suspects/suspect_1.png',
    suspicion: 0,
    trust: 0,
    memory: { history: [] },
  },
  {
    id: 'Suspect_2',
    name: 'Jane Smith',
    age: 28,
    occupation: 'Nurse',
    relationship_to_victim: 'Colleague',
    known_interactions: 'Discussed with victim yesterday',
    mugshot: '/images/gameBoy/suspects/suspect_2.png',
    suspicion: 0,
    trust: 0,
    memory: { history: [] },
  },
  {
    id: 'Suspect_3',
    name: 'Charlie Brown',
    age: 45,
    occupation: 'Teacher',
    relationship_to_victim: 'Neighbor',
    known_interactions: 'Saw victim come home last night',
    mugshot: '/images/gameBoy/suspects/suspect_3.png',
    suspicion: 0,
    trust: 0,
    memory: { history: [] },
  },
  {
    id: 'Suspect_4',
    name: 'Bob Brown',
    age: 40,
    occupation: 'Artist',
    relationship_to_victim: 'Stranger',
    known_interactions: 'Has heard a thing or two about the victim',
    mugshot: '/images/gameBoy/suspects/suspect_4.png',
    suspicion: 0,
    trust: 0,
    memory: { history: [] },
  },
  // Add more suspects here
]

// Initialize question counts (4 per suspect)
const initializeQuestionCounts = (): QuestionCounts => {
  const counts: QuestionCounts = {}
  initialSuspects.forEach((suspect) => {
    counts[suspect.id] = 4
  })
  return counts
}

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
    },
  },
  messages: [],
  currentSceneId: 'intro',
  currentSuspectId: initialSuspects[0].id, // Default to first suspect
  suspects: initialSuspects,
  scenes: {},
  clues: {},
  playerNotebook: [],
  gameOver: false,
  questionCounts: initializeQuestionCounts(),

  addNarrative: (newNarrative) =>
    set((state) => ({
      narrative: {
        ...state.narrative,
        detective_briefing: newNarrative.detective_briefing,
        scene: newNarrative.scene,
      },
    })),

  addMessage: (message) =>
    set((state) => {
      // If it's a player message, decrement the question count for the current suspect
      if (message.role === 'player' && state.currentSuspectId) {
        get().decrementQuestionCount(state.currentSuspectId)
      }
      return {
        messages: [...state.messages, { ...message, timestamp: Date.now() }],
      }
    }),

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

      // Create a new suspects array with the updated suspect
      const updatedSuspects = state.suspects.map((s) =>
        s.id === suspectId
          ? { ...s, suspicion: Math.max(0, s.suspicion + amount) }
          : s,
      )

      return { suspects: updatedSuspects }
    }),


  decrementQuestionCount: (suspectId) =>
    set((state) => ({
      questionCounts: {
        ...state.questionCounts,
        [suspectId]: Math.max(0, state.questionCounts[suspectId] - 1),
      },
    })),

  resetQuestionCounts: () =>
    set({
      questionCounts: initializeQuestionCounts(),
    }),

  updateSuspect: (id, updates) =>
    set((state) => {
      const updatedSuspects = state.suspects.map((suspect) => {
        if (suspect.id !== id) return suspect;

        return {
          ...suspect,
          ...updates,
          revealedClues: [
            ...(suspect.revealedClues ?? []), // default to empty array if undefined
            ...(updates.revealedClues ?? []), // append new clues
          ],
        };
      });

      return { suspects: updatedSuspects };
    }),


  resetGame: () =>
    set({
      messages: [],
      currentSceneId: 'intro',
      currentSuspectId: initialSuspects[0].id,
      playerNotebook: [],
      gameOver: false,
      questionCounts: initializeQuestionCounts(),
    }),

  updateSuspectMemory: (id, history) =>
    set((state) => ({
      suspects: state.suspects.map((suspect) =>
        suspect.id === id ? { ...suspect, memory: { history } } : suspect,
      ),
    })),
}))
