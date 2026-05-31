const Redis = require('ioredis');
const env = require('./env');
const logger = require('./logger');

let redis = null;
if (env.REDIS_URL) {
  redis = new Redis(env.REDIS_URL, { maxRetriesPerRequest: 2 });
  redis.on('connect', () => logger.info('Redis connected'));
  redis.on('error', (err) => logger.error('Redis error', { error: err.message }));
}

module.exports = redis;
