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
  characteristics: string[]
  secrets: string[]
  alibi: string
  relationships: Record<string, string>
  suspicion: number
  trust: number
  mugshot: string
  guessCount: number
  age: number
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