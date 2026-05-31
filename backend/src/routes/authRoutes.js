const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { z } = require('zod');
const User = require('../models/User');
const validate = require('../middleware/validate');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/tokens');
const { sendEmail } = require('../services/emailService');

const router = express.Router();

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(120),
    email: z.string().email(),
    password: z.string().min(8).max(128),
  }),
  params: z.object({}),
  query: z.object({}),
});

router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const { name, email, password } = req.validated.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash });

    await sendEmail({
      to: email,
      subject: 'Welcome to Mahin AI',
      html: `<p>Hello ${name}, welcome to Mahin AI.</p>`,
    });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await user.save();

    return res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return next(error);
  }
});

const loginSchema = z.object({
  body: z.object({ email: z.string().email(), password: z.string().min(8).max(128) }),
  params: z.object({}),
  query: z.object({}),
});

router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.validated.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await user.save();

    return res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken) return res.status(400).json({ message: 'refreshToken required' });

  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.sub);
    if (!user || !user.refreshTokenHash) return res.status(401).json({ message: 'Invalid refresh token' });

    const valid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!valid) return res.status(401).json({ message: 'Invalid refresh token' });

    const accessToken = signAccessToken(user);
    return res.json({ accessToken });
  } catch (_error) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
});

router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken) return res.status(204).send();

  try {
    const payload = verifyRefreshToken(refreshToken);
    await User.findByIdAndUpdate(payload.sub, { $set: { refreshTokenHash: '' } });
  } catch (_error) {
    // ignore invalid token
  }

  return res.status(204).send();
});

router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.json({ message: 'If email exists, reset link sent' });

    const raw = crypto.randomBytes(32).toString('hex');
    user.resetPasswordTokenHash = await bcrypt.hash(raw, 10);
    user.resetPasswordTokenExpiresAt = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();

    const resetUrl = `https://${process.env.DOMAIN || 'localhost:3000'}/reset-password?token=${raw}&email=${encodeURIComponent(email)}`;
    await sendEmail({
      to: email,
      subject: 'Mahin AI password reset',
      html: `<p>Reset your password using: <a href="${resetUrl}">${resetUrl}</a></p>`,
    });

    return res.json({ message: 'If email exists, reset link sent' });
  } catch (error) {
    return next(error);
  }
});

router.post('/reset-password', async (req, res, next) => {
  try {
    const { email, token, password } = req.body || {};
    if (!email || !token || !password) return res.status(400).json({ message: 'Invalid request' });

    const user = await User.findOne({ email });
    if (!user || !user.resetPasswordTokenHash || !user.resetPasswordTokenExpiresAt) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    if (user.resetPasswordTokenExpiresAt < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const valid = await bcrypt.compare(token, user.resetPasswordTokenHash);
    if (!valid) return res.status(400).json({ message: 'Invalid or expired token' });

    user.passwordHash = await bcrypt.hash(password, 12);
    user.resetPasswordTokenHash = '';
    user.resetPasswordTokenExpiresAt = null;
    user.refreshTokenHash = '';
    await user.save();

    return res.json({ message: 'Password reset successful' });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
