import Queue from 'bull';
import { getRedisClient } from './redis';
import { logger } from '../utils/logger';
import { processImageGeneration } from '../jobs/imageGenerationJob';
import { processContentGeneration } from '../jobs/contentGenerationJob';

let imageGenerationQueue: Queue.Queue;
let contentGenerationQueue: Queue.Queue;

export interface ImageGenerationPayload {
  jobId: number;
  userId: number;
  imageUrl: string;
  productDescription: string;
}

export interface ContentGenerationPayload {
  jobId: number;
  userId: number;
  productName: string;
  productDescription: string;
  price: number;
  category: string;
}

export const initializeQueues = (): void => {
  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

    imageGenerationQueue = new Queue('image-generation', redisUrl);
    contentGenerationQueue = new Queue('content-generation', redisUrl);

    // Process image generation jobs
    imageGenerationQueue.process(10, processImageGeneration);
    imageGenerationQueue.on('completed', (job) => {
      logger.info(`Image generation job ${job.id} completed`);
    });
    imageGenerationQueue.on('failed', (job, error) => {
      logger.error(`Image generation job ${job.id} failed:`, error.message);
    });

    // Process content generation jobs
    contentGenerationQueue.process(10, processContentGeneration);
    contentGenerationQueue.on('completed', (job) => {
      logger.info(`Content generation job ${job.id} completed`);
    });
    contentGenerationQueue.on('failed', (job, error) => {
      logger.error(`Content generation job ${job.id} failed:`, error.message);
    });

    logger.info('Job queues initialized successfully');
  } catch (error) {
    logger.error('Queue initialization failed:', error);
    throw error;
  }
};

export const enqueueImageGeneration = async (payload: ImageGenerationPayload): Promise<Queue.Job> => {
  return imageGenerationQueue.add(payload, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  });
};

export const enqueueContentGeneration = async (payload: ContentGenerationPayload): Promise<Queue.Job> => {
  return contentGenerationQueue.add(payload, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  });
};

export const getImageGenerationQueue = (): Queue.Queue => imageGenerationQueue;
export const getContentGenerationQueue = (): Queue.Queue => contentGenerationQueue;
