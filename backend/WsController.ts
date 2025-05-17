import { WebSocket } from '@fastify/websocket';
import { FastifyRequest } from 'fastify';
import { askSuspect, createNarrative } from "./aiService";
import type { SuspectProfile } from '../types/types';
import { game } from './GameManager';

interface QuestionMessage {
    type: 'question';
    suspect: { id: string };
    message: { content: string };
}

let narrative: any;

export class WsController {
    private static instance: WsController;
    private suspects: SuspectProfile[];
    private gameManager = game;
    constructor() {
        this.suspects = [];
    }

    static getInstance(): WsController {
        if (!WsController.instance) {
            WsController.instance = new WsController();
        }
        return WsController.instance;
    }

    async play(ws: any, req: FastifyRequest) {
        console.log('Client connected');

        ws.on('close', () => {
            console.log('Client disconnected');
        });
        ws.on('error', () => {
            console.log('Client error');
        });
        ws.on('message', async (raw) => {
            if (this.suspects.length === 0) {
                console.log('Game not initialized, creating narrative...');
                this.suspects = this.gameManager.getSuspects();
            }
            const data = JSON.parse(raw);
            console.log('Received message:', data);
            if (data.type === 'question') {
                try {
                    let suspect = this.suspects.find((s) => s.id === data.suspect.id);
                    if (!suspect) {
                        suspect = {
                            id: data.suspect.id,
                            summary: data.suspect.SuspectSummary,
                            personality: data.suspect.personality,
                            motive: data.suspect.motive,
                            alibi: data.suspect.alibi,
                            how_they_speak: data.suspect.how_they_speak,
                            secret: data.suspect.secret,
                            clues: data.suspect.clues,
                            suspicion: 0,
                            trust: 0,
                            guessCount: 0,
                            age: 0,
                        };
                    }
                    const ai = await askSuspect(suspect, data.message.content);
                    console.log('question:', data.message);
                    const response = {
                        type: 'response',
                        message: {
                            content: ai.output_text,
                            role: 'suspect',
                            suspectId: suspect.id,
                            history: suspect.summary.memory.history,
                        }
                    };
                    this.isContainTriggerWord(ws, ai.output_text, suspect);
                    ws.send(JSON.stringify(response));
                } catch (error) {
                    console.error('Error processing question:', error);
                    ws.send(JSON.stringify({
                        type: 'error',
                        message: 'Error processing question',
                    }));
                }
            }
        });
    }

    isContainTriggerWord(ws: WebSocket, message: string, suspect: SuspectProfile) {
        console.log('suspects speaking:', suspect);
        console.log('message:', message);
        for (const clue of suspect.clues.distracting.triggeredBy) {
            console.log('distracting clue:', clue);
        }
        for (const clue of suspect.clues.genuine.triggeredBy) {
            console.log('genuine clue:', clue);
        }
        const distractingTriggerWords = suspect.clues.distracting.triggeredBy;
        const genuineTriggerWords = suspect.clues.genuine.triggeredBy;
        const isDistracting = distractingTriggerWords.some((word: string) => message.includes(word));
        let content = '';
        const isGenuine = genuineTriggerWords.some((word: string) => message.includes(word));
        if (isDistracting) {
            console.log(`Distracting clue triggered by: ${distractingTriggerWords}`);
            this.gameManager.updateSuspicion(suspect.id, 1);
            content = suspect.clues.distracting.content;
        }
        if (isGenuine) {
            console.log(`Genuine clue triggered by: ${genuineTriggerWords}`);
            this.gameManager.updateTrust(suspect.id, 1);
            content = suspect.clues.genuine.content;
        }
        if (!isDistracting && !isGenuine) {
            console.log('No trigger words found');
            return;
        }
        const response = {
            type: 'reveal',
            message: {
                content: content,
                role: 'suspect',
                suspicionChange: isDistracting ? 1 : 0,
                trustChange: isGenuine ? 1 : 0,
                suspectId: suspect.id,
                suspicion: this.gameManager.getSuspects().find((s) => s.id === suspect.id)?.suspicion,
                trust: this.gameManager.getSuspects().find((s) => s.id === suspect.id)?.trust,
            }
        }
        ws.send(JSON.stringify(response));
    }
}
