// src/redisClient.ts

import {
    createClient
} from 'redis';
import logger from './logger';
import {
    LandData
} from '../types';
require('dotenv').config();

const url = process.env.REDIS_URL || 'redis://localhost:6379';

async function setup() {
    const redisClient = createClient({
        url
    });
    redisClient.on('connect', () => logger.info('Connected to Redis'));
    redisClient.on('error', (err) => logger.error('Redis Client Error', err));
    await redisClient.connect();
    return redisClient;
}

const initializeRedisClient = setup();
export default initializeRedisClient;

// Function to add a listing as a simple key-value pair
export async function addListing(key: string, value: LandData): Promise < boolean > {
    const redisClient = await initializeRedisClient;

    try {
        await redisClient.set(key, JSON.stringify(value));    
    } catch (error) {
        throw new Error(`Error adding listing: ${error}`);
    }
    
    return true;
}

export async function findMatchingKeys(pattern: string): Promise < string[] > {
    const redisClient = await initializeRedisClient;
    let cursor = 0;
    const keys = [];

    do {
        // Adjust the call to the SCAN command according to the expected format
        // Using an options object for MATCH and COUNT parameters
        const reply = await redisClient.scan(cursor, {
            MATCH: pattern,
            COUNT: 100
        });

        cursor = reply.cursor;
        keys.push(...reply.keys);
    } while (cursor !== 0);

    return keys;
}

export async function isExistingListing(key: string): Promise <boolean> {
    const redisClient = await initializeRedisClient;
    const resultListing = await redisClient.exists(key);


    if (resultListing >= 1) {
        return true;
    } else {
        return false;
    }

}
