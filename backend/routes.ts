import websocketPlugin from '@fastify/websocket';
import { WsController } from './WsController';
import { APIController } from './APIController';
import { FastifyInstance } from 'fastify';


export default async function routes(fastify: FastifyInstance) {
  const wsController = WsController.getInstance();
  const apiController = APIController.getInstance();

  // Register the API route
  fastify.get('/api', (req, reply) => apiController.getAPI(req, reply));
  // Register the WebSocket route
  fastify.get('/game/', { websocket: true }, (socket: any, request) =>
    wsController.play.bind(wsController)(socket, request)
  );
}

