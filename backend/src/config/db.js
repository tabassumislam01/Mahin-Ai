const mongoose = require('mongoose');
const env = require('./env');
const logger = require('./logger');

async function connectDb() {
  if (!env.MONGODB_URI) throw new Error('MONGODB_URI is required');

  mongoose.set('strictQuery', true);
  await mongoose.connect(env.MONGODB_URI, {
    maxPoolSize: 20,
    minPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
  });

  logger.info('MongoDB connected');
}

module.exports = { connectDb };
