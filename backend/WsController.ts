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
            console.log('Received message:', message);
        });
    }
}
