import { WebSocket } from '@fastify/websocket';
import { FastifyRequest } from 'fastify';

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
        ws.on('close', () => {
            console.log('Client disconnected');
        });
        ws.on('error', () => {
            console.log('Client error');
        });
        ws.on('message', (message: string) => {
            const data = JSON.parse(message);
            console.log('Received message:', data);
            if (data.type === 'question') {
                // Handle action message
                console.log('question:', data.message);
                const response = {
                    type: 'response',
                    message: {
                        content: 'We dated... That doesn’t mean I killed her!',
                        role: 'suspect',
                        suspicionChange: 1,
                    }
                }
                ws.send(JSON.stringify(response));
            }
        });
    }
}
