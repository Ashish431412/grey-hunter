import http from 'http';
import app from './app';
import { config } from './config/index';
import { logger } from './utils/logger';
import { setupWebsocket } from './websocket';
import { prisma } from './config/database';

const server = http.createServer(app);

setupWebsocket(server);

const startServer = async () => {
  try {
    await prisma.$connect();
    logger.info('Connected to the database');
    
    server.listen(config.port, () => {
      logger.info(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
