import { WebSocket } from '@fastify/websocket';
import { FastifyRequest } from 'fastify';
import { askSuspect, createNarrative } from "./aiService";
import type { SuspectProfile } from '../types/types';

interface QuestionMessage {
  type: 'question';
  suspect: { id: string };
  message: { content: string };
}

let narrative: any;

export class WsController {
    private static instance: WsController;
    private suspects: Record<string, SuspectProfile> = {};
    constructor() {
    }

    static getInstance(): WsController {
        if (!WsController.instance) {
            WsController.instance = new WsController();
        }
        return WsController.instance;
    }

    async play(ws: any, req: FastifyRequest) {

			console.log('Client connected');
			
			// just test narrative creation and print it to console
			// if (!narrative) {
			// 	narrative = await createNarrative();
			// 	console.log('narrative:', narrative);
			// }

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
                    let suspect = this.suspects[data.suspect.id];
                    if (!suspect) {
                        suspect = {
                            id: data.suspect.id,
                            name: data.suspect.name,
                            personality: data.suspect.personality,
                            characteristics: data.suspect.characteristics,
                            secrets: data.suspect.secrets,
                            alibi: data.suspect.alibi,
                            relationships: data.suspect.relationships,
                            suspicion: data.suspect.suspicion,
                            trust: data.suspect.trust,
                            mugshot: data.suspect.mugshot,
                            guessCount: data.suspect.guessCount,
                            age: data.suspect.age,
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
