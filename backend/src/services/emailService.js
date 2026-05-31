const { Resend } = require('resend');
const env = require('../config/env');
const logger = require('../config/logger');

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

async function sendEmail({ to, subject, html }) {
  if (!resend) {
    logger.warn('Resend not configured, skipping email', { to, subject });
    return;
  }

  await resend.emails.send({ from: env.EMAIL_FROM, to, subject, html });
}

module.exports = { sendEmail };
