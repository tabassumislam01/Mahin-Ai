import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { logger } from '../utils/logger.js';

export const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d' }
  );

  return { accessToken, refreshToken };
};

export const registerUser = async (email, password, name) => {
  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new user
    const user = new User({ email, password, name });
    await user.save();

    logger.info(`✅ User registered: ${email}`);
    return user;
  } catch (error) {
    logger.error(`❌ Registration error: ${error.message}`);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    logger.info(`✅ User logged in: ${email}`);
    return user;
  } catch (error) {
    logger.error(`❌ Login error: ${error.message}`);
    throw error;
  }
};

export const verifyRefreshToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      throw new Error('Invalid refresh token');
    }

    return user;
  } catch (error) {
    logger.error(`❌ Refresh token error: ${error.message}`);
    throw error;
  }
};
