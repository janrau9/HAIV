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

export type SuspectSummary = {
	name: string
	age: number
	occupation: string
	relationship_to_victim: string
	alibi: string
}

export type SuspectProfile = {
	id: string
	summary: SuspectSummary
	personality: string
	motive: string
	alibi: string
	how_they_speak: string
	secret: string
	clues: {
		genuine: string
		distracting: string
	}
	suspicion: number
	trust: number
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