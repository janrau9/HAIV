// Import environment variables
import dotenv from 'dotenv';
dotenv.config();
import fastify from 'fastify';
import websocketPlugin from '@fastify/websocket';
import routes from './routes';
import cors from '@fastify/cors';

// Create Fastify instance
const app = fastify({
  logger: false
});
const start = async () => {
  try {
    // Register fastify-jwt plugin with secret from env variables
    // Register routes
    await app.register(cors, {
      origin: 'http://localhost:5173', // or use `true` to allow all origins during dev
    })
    app.register(websocketPlugin); // Register websocket plugin

    app.register(routes); // Register user routes inside the plugin

    // Handle uncaught exceptions (prevents crashes)
    process.on('uncaughtException', (error) => {
      console.error('🔥 Uncaught Exception:', error);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.warn('⚠️ Unhandled Promise Rejection at:', promise, 'Reason:', reason);
    });

    await app.listen({ port: Number(process.env.BACKEND_PORT) || 8000, host: '0.0.0.0' });
    console.log(`Server running on port ${process.env.BACKEND_PORT || 8000}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
