import Redis from 'redis';
import { logger } from '../utils/logger';

let redisClient: Redis.RedisClient;

export const initializeRedis = async (): Promise<void> => {
  try {
    const client = Redis.createClient({
      url: process.env.REDIS_URL,
    });

    client.on('error', (error) => {
      logger.error('Redis error:', error);
    });

    client.on('connect', () => {
      logger.info('Redis connected');
    });

    await client.connect();
    redisClient = client;
  } catch (error) {
    logger.error('Redis initialization failed:', error);
    throw error;
  }
};

export const getRedisClient = (): Redis.RedisClient => {
  if (!redisClient) {
    throw new Error('Redis not initialized');
  }
  return redisClient;
};

export const setCache = async (key: string, value: any, ttl: number = 3600): Promise<void> => {
  const client = getRedisClient();
  await client.setEx(key, ttl, JSON.stringify(value));
};

export const getCache = async (key: string): Promise<any> => {
  const client = getRedisClient();
  const value = await client.get(key);
  return value ? JSON.parse(value) : null;
};

export const deleteCache = async (key: string): Promise<void> => {
  const client = getRedisClient();
  await client.del(key);
};
