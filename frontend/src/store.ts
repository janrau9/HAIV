import { create } from 'zustand'
import type { Message, SuspectProfile, Clue, Scene } from '../../types/types' // Adjust the import path as necessary

// New interface for managing question counts
interface QuestionCounts {
  [suspectId: string]: number;
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
  questionCounts: QuestionCounts // New field to track question counts

  // Actions
  addMessage: (message: Message) => void
  setCurrentSuspect: (id: string) => void
  markClueFound: (clueId: string) => void
  adjustSuspicion: (suspectId: string, amount: number) => void
  resetGame: () => void
  decrementQuestionCount: (suspectId: string) => void
  resetQuestionCounts: () => void
}

// Create an extended SuspectProfile interface with narrative-based fields
export interface SuspectProfileWithDefaults extends SuspectProfile {
  occupation?: string;
  relationship_to_victim?: string;
  summary?: {
    name: string;
    age: number;
    occupation: string;
    relationship_to_victim: string;
    alibi: string;
  };
}

const initialSuspects: SuspectProfileWithDefaults[] = [
  {
    id: 'suspect_1',
    name: 'John Doe',
    personality: 'aggressive',
    secrets: ['Has a criminal record'],
    alibi: 'Was at the bar during incident',
    age: 35,
    occupation: 'Security Guard',
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
    occupation: 'Lab Technician',
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
    occupation: 'Company Executive',
    relationships: {},
    suspicion: 0,
    trust: 0,
    guessCount: 0,
    mugshot: '/images/gameBoy/suspects/suspect_5.png',
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
    occupation: 'IT Specialist',
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

// Initialize question counts (4 per suspect)
const initializeQuestionCounts = (): QuestionCounts => {
  const counts: QuestionCounts = {};
  initialSuspects.forEach(suspect => {
    counts[suspect.id] = 4;
  });
  return counts;
};

export const useGameStore = create<GameState>((set, get) => ({
  messages: [],
  currentSceneId: 'intro',
  currentSuspectId: initialSuspects[0].id, // Default to first suspect
  suspects: initialSuspects,
  scenes: {},
  clues: {},
  playerNotebook: [],
  gameOver: false,
  questionCounts: initializeQuestionCounts(),

  addMessage: (message) =>
    set((state) => {
      // If it's a player message, decrement the question count for the current suspect
      if (message.role === 'player' && state.currentSuspectId) {
        get().decrementQuestionCount(state.currentSuspectId);
      }
      return {
        messages: [...state.messages, { ...message, timestamp: Date.now() }],
      };
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
      const suspect = state.suspects.find((s) => s.id === suspectId);
      if (!suspect) return {};
      
      // Create a new suspects array with the updated suspect
      const updatedSuspects = state.suspects.map(s => 
        s.id === suspectId 
          ? { ...s, suspicion: Math.max(0, s.suspicion + amount) } 
          : s
      );
      
      return { suspects: updatedSuspects };
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

  resetGame: () =>
    set({
      messages: [],
      currentSceneId: 'intro',
      currentSuspectId: initialSuspects[0].id,
      playerNotebook: [],
      gameOver: false,
      questionCounts: initializeQuestionCounts(),
    }),
}))
