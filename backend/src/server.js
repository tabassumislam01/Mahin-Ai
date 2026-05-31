const http = require('http');
const app = require('./app');
const env = require('./config/env');
const logger = require('./config/logger');
const { connectDb } = require('./config/db');
const initSocket = require('./socket');

async function bootstrap() {
  await connectDb();

  const server = http.createServer(app);
  initSocket(server);

  server.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT}`);
  });
}

bootstrap().catch((error) => {
  logger.error('Failed to bootstrap', { error: error.message, stack: error.stack });
  process.exit(1);
});
