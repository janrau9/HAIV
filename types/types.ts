import type { ChatResponse } from '../backend/src/aiService'

export type Role = 'player' | 'Suspect' | 'narrator' | 'system'
export type GameState = 'playing' | 'accused' | 'won' | 'lost'


export type Narrative = {
  detective_briefing: string
  scene: {
    when: string,
    where: string;
    victim: {
      name: string,
      age: number,
      description: string;
    }
  }
}

export type NarrativeResponse = {
  detective_briefing: string
  scene: {
    when: string,
    where: string;
    victim: {
      name: string,
      age: number,
      description: string;
    }
  }
  suspects: SuspectProfile[]
}

export type Message = {
  id: string
  role: Role
  speakerId?: string
  suspectId?: string
  content: string
  emotion?: string
  sceneId?: string
  suspicionChange?: number
  tags?: string[]
  timestamp?: number
}

export type SuspectSummary = {
  id: string
  name: string
  age: number
  occupation: string
  relationship_to_victim: string
  mugshot: string
  alibi?: string
  known_interactions: string
  suspicion: number
  trust: number
  revealedClues?: string[]
  memory?: {
    history: ChatResponse[];
  };
}

// if you change anything here, update that change to WsController.ts as well please!
export type SuspectProfile = {
  id: string
  summary: SuspectSummary
  personality: string
  motive: string
  alibi: string
  how_they_speak: string
  secret: string
  clues: {
    genuine: Clue
    distracting: Clue
  }
  suspicion: number
  trust: number
  guessCount: number
  age: number
}

// types/clue.ts
export type Clue = {
  id: string;
  content: string;
  category: 'evidence' | 'motive' | 'alibi' | 'relationship' | 'behavior';
  suspectId?: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  revealed: boolean;
  triggeredBy?: string[]; // keywords
  isDynamic?: boolean;
};


export type Scene = {
  id: string
  name: string
  isLocked: boolean
  suspects: string[] // suspect IDs
  clueIds: string[]
}