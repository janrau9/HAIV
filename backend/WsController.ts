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
    private suspects: Record<string, SuspectProfile> = {};
    private gameManager = game;
    constructor() {
        this.suspects = this.gameManager.getSuspects().reduce((acc, suspect) => {
            acc[suspect.id] = suspect;
            return acc;
        }, {});
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
            const data = JSON.parse(raw);
            console.log('Received message:', data);
            if (data.type === 'question') {
                try {
                    let suspect = this.suspects[0];
                    if (!suspect) {
                        suspect = {
                            id: data.suspect.id,
                            summary: data.SuspectSummary,
                            personality: '',
                            motive: '',
                            alibi: '',
                            how_they_speak: '',
                            secret: '',
                            clues: {
                                genuine: [],
                                distracting: [],
                            },
                            suspicion: 0,
                            trust: 0,
                            guessCount: 0,
                            age: 0,
                            memory: {
                                history: [],
                            },
                        };
                        this.suspects[data.suspect.id] = suspect;
                    }
                    const ai = await askSuspect(suspect, data.message.content);
                    console.log('question:', data.message);
                    const response = {
                        type: 'response',
                        message: {
                            content: ai.output_text,
                            role: 'suspect',
                            suspicionChange: 1,
                            suspectId: suspect.id,
                        }
                    }
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
        const distractingTriggerWords = suspect.clues.distracting[0].triggeredBy;
        const genuineTriggerWords = suspect.clues.genuine[0].triggeredBy;
        const isDistracting = distractingTriggerWords.some((word: string) => message.includes(word));
        let content = '';
        const isGenuine = genuineTriggerWords.some((word: string) => message.includes(word));
        if (isDistracting) {
            console.log(`Distracting clue triggered by: ${distractingTriggerWords}`);
            this.gameManager.updateSuspicion(suspect.id, 1);
            content = suspect.clues.distracting[0].content;
        }
        if (isGenuine) {
            console.log(`Genuine clue triggered by: ${genuineTriggerWords}`);
            this.gameManager.updateTrust(suspect.id, 1);
            content = suspect.clues.genuine[0].content;
        }
        const response = {
            type: 'reveal',
            message: {
                content: content,
                role: 'suspect',
                suspicionChange: isDistracting ? 1 : 0,
                trustChange: isGenuine ? 1 : 0,
                suspectId: suspect.id,
            }
        }
        ws.send(JSON.stringify(response));
    }
}
