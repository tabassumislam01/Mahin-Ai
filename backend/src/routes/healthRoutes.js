const express = require('express');

const router = express.Router();

router.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'mahin-ai-backend', timestamp: new Date().toISOString() });
});

router.get('/ready', (_req, res) => {
  res.json({ status: 'ready' });
});

module.exports = router;
