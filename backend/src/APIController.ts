import { FastifyReply, FastifyRequest } from 'fastify';
import { createNarrative, createNarrativeWithRetry } from './aiService';

export class APIController {
    private static instance: APIController;

    constructor() {
    }

    static getInstance() {
        if (!APIController.instance) {
            APIController.instance = new APIController();
        }
        return APIController.instance;
    }
    async getAPI(req: FastifyRequest, reply: FastifyReply) {
        const api = {
            status: 'ok',
            message: 'API is running',
        };
        reply.send(api);
    }
    async getNarrative(req: FastifyRequest, reply: FastifyReply) {
			const narrative = await createNarrativeWithRetry();
			console.log(narrative);
        reply.send(narrative);
    }
}
