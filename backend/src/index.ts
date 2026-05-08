import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { initializeShopifyApp } from './services/shopify';
import { initializeDatabase } from './db/database';
import { initializeRedis } from './services/redis';
import { setupRoutes } from './routes';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize services
async function initializeServices() {
  try {
    logger.info('Initializing database...');
    await initializeDatabase();
    
    logger.info('Initializing Redis...');
    await initializeRedis();
    
    logger.info('Initializing Shopify app...');
    initializeShopifyApp(app);
    
    logger.info('Setting up routes...');
    setupRoutes(app);
    
    // Error handling middleware (must be last)
    app.use(errorHandler);
    
    // Start server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to initialize services:', error);
    process.exit(1);
  }
}

initializeServices();

export default app;
