// Import environment variables
import dotenv from 'dotenv';
import fastify from 'fastify';
import websocketPlugin from '@fastify/websocket';
import routes from './routes';


dotenv.config();

// Create Fastify instance
const app = fastify({
  logger: true
});
const start = async () => {
  try {
    // Register fastify-jwt plugin with secret from env variables
    // Register routes
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
