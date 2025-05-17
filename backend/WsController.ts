import { WebSocket } from '@fastify/websocket';
import { FastifyRequest } from 'fastify';
import { askSuspect, createNarrative } from "./aiService";

let narrative: any;

export class WsController {
    private static instance: WsController;
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
			if (!narrative) {
				narrative = await createNarrative();
				console.log('narrative:', narrative);
			}

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
                // Handle action message
                try {
                    const ai = await askSuspect(data.suspect, data.message.content);
                    console.log('question:', data.message);
                    const response = {
                        type: 'response',
                        message: {
                            content: ai.output_text,
                            role: 'suspect',
                            suspicionChange: 1,
                            suspectId: data.suspect.id,
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
