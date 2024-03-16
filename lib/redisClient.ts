// src/redisClient.ts

import { createClient } from 'redis';
import logger from './logger';
const dotenv = await import('dotenv');
dotenv.config();

const url = process.env.REDIS_URL || 'redis://localhost:6379';

// Create and configure the Redis client
const redisClient = await createClient({
    url
});


    redisClient.on('connect', () => logger.info('Connected to Redis'));
    redisClient.on('error', (err) => logger.error('Redis Client Error', err));
    redisClient.connect();

export default redisClient;