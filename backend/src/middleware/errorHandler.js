const logger = require('../config/logger');

function notFound(req, res) {
  res.status(404).json({ message: `Not found: ${req.originalUrl}` });
}

function errorHandler(err, req, res, _next) {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
}

module.exports = { notFound, errorHandler };
