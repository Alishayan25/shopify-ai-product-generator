import { Express } from 'express';
import shopifyApp from '@shopify/shopify-app-express';
import { BillingInterval } from '@shopify/shopify-api';
import { logger } from '../utils/logger';

const shopifyAppInstance = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY!,
  apiSecret: process.env.SHOPIFY_API_SECRET!,
  scopes: (process.env.SHOPIFY_SCOPES || '').split(','),
  appUrl: process.env.SHOPIFY_APP_URL!,
  apiVersion: '2024-01',
  isEmbeddedApp: true,
  distribution: undefined,
});

export const initializeShopifyApp = (app: Express): void => {
  app.use(shopifyAppInstance.auth.begin());
  app.get(
    '/auth/shopify/callback',
    shopifyAppInstance.auth.callback(),
    shopifyAppInstance.redirectToShopifyOrAppRoot()
  );
  app.use(shopifyAppInstance.csurf.middleware());
  
  logger.info('Shopify app initialized');
};

export { shopifyAppInstance };
