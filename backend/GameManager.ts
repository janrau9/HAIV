// GameLogicManager.ts
import { Clue, SuspectProfile, GameState } from '../types/types'

class GameLogicManager {
    private static instance: GameLogicManager

    private suspects: SuspectProfile[] = []
    private clues: Clue[] = []
    private gameState: GameState = 'playing'
    private killerId: string | null = null

    private constructor() { }

    public static getInstance(): GameLogicManager {
        if (!GameLogicManager.instance) {
            GameLogicManager.instance = new GameLogicManager()
        }
        return GameLogicManager.instance
    }

    initGame(suspects: SuspectProfile[], clues: Clue[], killerId: string) {
        this.suspects = suspects
        this.clues = clues
        this.killerId = killerId
        this.gameState = 'playing'
    }

    getGameState(): GameState {
        return this.gameState
    }

    getSuspects(): SuspectProfile[] {
        return this.suspects
    }

    getClues(): Clue[] {
        return this.clues
    }

    discoverClue(clueId: string) {
        const clue = this.clues.find(c => c.id === clueId)
        if (clue && !clue.discovered) {
            clue.discovered = true
            if (clue.suspectId) {
                this.updateSuspicion(clue.suspectId, 1)
            }
        }
    }

    updateSuspicion(suspectId: string, amount: number) {
        const suspect = this.suspects.find(s => s.id === suspectId)
        if (suspect) {
            suspect.suspicion += amount
            suspect.suspicion = Math.min(10, Math.max(0, suspect.suspicion)) // Clamp between 0–10
        }
    }

    updateTrust(suspectId: string, amount: number) {
        const suspect = this.suspects.find(s => s.id === suspectId)
        if (suspect) {
            suspect.trust += amount
            suspect.trust = Math.min(10, Math.max(0, suspect.trust)) // Clamp between 0–10
        }
    }

    accuseSuspect(suspectId: string): { result: 'win' | 'lose', message: string } {
        if (this.gameState !== 'playing') {
            return { result: 'lose', message: 'Game already ended.' }
        }

        this.gameState = 'accused'

        if (suspectId === this.killerId) {
            this.gameState = 'won'
            return { result: 'win', message: `You correctly accused ${this.getSuspectName(suspectId)}. Case closed!` }
        } else {
            this.gameState = 'lost'
            return { result: 'lose', message: `You wrongly accused ${this.getSuspectName(suspectId)}. The real killer escaped.` }
        }
    }

    private getSuspectName(id: string): string {
        return this.suspects.find(s => s.id === id)?.name || 'Unknown Suspect'
    }

    resetGame() {
        this.suspects = []
        this.clues = []
        this.killerId = null
        this.gameState = 'playing'
    }
}

export const gameLogic = GameLogicManager.getInstance()
