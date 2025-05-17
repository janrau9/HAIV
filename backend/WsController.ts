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
					this.suspects = this.gameManager.getSuspects().reduce((acc, suspect) => {
						acc[suspect.id] = suspect;
						return acc;
					}, {});
            const data = JSON.parse(raw);
            console.log('Received message:', data);
            if (data.type === 'question') {
                try {
                    let suspect = this.suspects[data.suspect.id];
									if (!suspect) {
												console.log('Suspect not found, creating new suspect');
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
}
