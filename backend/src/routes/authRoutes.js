import express from 'express';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import { z } from 'zod';
import User from '../models/User.js';
import validate from '../middleware/validate.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/tokens.js';
import { sendEmail } from '../services/emailService.js';
import { logger } from '../utils/logger.js';

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
    if (existing) return res.status(409).json({ success: false, message: 'Email already in use' });

    const salt = await bcryptjs.genSalt(parseInt(process.env.BCRYPT_ROUNDS || 10));
    const passwordHash = await bcryptjs.hash(password, salt);
    
    const user = await User.create({ 
      name, 
      email, 
      password: passwordHash 
    });

    await sendEmail({
      to: email,
      subject: 'Welcome to Mahin AI',
      html: `<p>Hello ${name}, welcome to Mahin AI. Your account has been created successfully.</p>`,
    });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    
    logger.info(`✅ User registered: ${email}`);

    return res.status(201).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error(`❌ Registration error: ${error.message}`);
    return next(error);
  }
});

const loginSchema = z.object({
  body: z.object({ email: z.string().email(), password: z.string().min(8).max(128) }),
  params: z.object({}),
  query: z.object({}),
});
const refreshSchema = z.object({
  body: z.object({ refreshToken: z.string().min(10) }),
  params: z.object({}),
  query: z.object({}),
});
const forgotPasswordSchema = z.object({
  body: z.object({ email: z.string().email() }),
  params: z.object({}),
  query: z.object({}),
});
const resetPasswordSchema = z.object({
  body: z.object({
    email: z.string().email(),
    token: z.string().min(10),
    password: z.string().min(8).max(128),
  }),
  params: z.object({}),
  query: z.object({}),
});

router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.validated.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      logger.warn(`❌ Login attempt with non-existent email: ${email}`);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const valid = await bcryptjs.compare(password, user.password);
    if (!valid) {
      logger.warn(`❌ Login attempt with wrong password: ${email}`);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    logger.info(`✅ User logged in: ${email}`);

    return res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error(`❌ Login error: ${error.message}`);
    return next(error);
  }
});

router.post('/refresh', validate(refreshSchema), async (req, res) => {
  const { refreshToken } = req.validated.body;

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

router.post('/logout', validate(refreshSchema), async (req, res) => {
  const { refreshToken } = req.validated.body;
  if (!refreshToken) return res.status(204).send();

  try {
    const payload = verifyRefreshToken(refreshToken);
    await User.findByIdAndUpdate(payload.sub, { $set: { refreshTokenHash: '' } });
  } catch (_error) {
    // ignore invalid token
  }

  return res.status(204).send();
});

router.post('/forgot-password', validate(forgotPasswordSchema), async (req, res, next) => {
  try {
    const { email } = req.validated.body;

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

router.post('/reset-password', validate(resetPasswordSchema), async (req, res, next) => {
  try {
    const { email, token, password } = req.validated.body;

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

export default router;
