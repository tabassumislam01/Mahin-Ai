import { createClient } from 'redis';
import { logger } from '../utils/logger.js';

let redisClient = null;

export const initializeRedis = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    redisClient.on('error', (err) => {
      logger.error(`Redis error: ${err}`);
    });

    await redisClient.connect();
    logger.info('✅ Redis connected');
    return redisClient;
  } catch (error) {
    logger.warn(`⚠️  Redis not available: ${error.message}. Running without cache.`);
    return null;
  }
};

export const getRedisClient = () => redisClient;

export const cacheSet = async (key, value, ttl = 3600) => {
  try {
    if (!redisClient) return;
    await redisClient.setEx(key, ttl, JSON.stringify(value));
  } catch (error) {
    logger.error(`Cache set error: ${error.message}`);
  }
};

export const cacheGet = async (key) => {
  try {
    if (!redisClient) return null;
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error(`Cache get error: ${error.message}`);
    return null;
  }
};

export const cacheDel = async (key) => {
  try {
    if (!redisClient) return;
    await redisClient.del(key);
  } catch (error) {
    logger.error(`Cache delete error: ${error.message}`);
  }
};
