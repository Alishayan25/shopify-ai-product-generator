import { Express } from 'express';
import uploadRoutes from './upload';
import generationRoutes from './generation';
import shopifyRoutes from './shopify';

export const setupRoutes = (app: Express): void => {
  app.use('/api/upload', uploadRoutes);
  app.use('/api/generate', generationRoutes);
  app.use('/api/shopify', shopifyRoutes);
};
