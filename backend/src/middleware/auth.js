import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { logger } from '../utils/logger.js';

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      logger.warn('No authorization token provided');
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.substring(7);

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Token expired' });
      }
      throw error;
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      logger.warn(`User not found: ${decoded.userId}`);
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.isActive) {
      logger.warn(`Inactive user attempted access: ${decoded.userId}`);
      return res.status(403).json({ success: false, message: 'User account is inactive' });
    }

    req.user = { userId: user._id, role: user.role };
    next();
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`);
    return res.status(401).json({ success: false, message: 'Authentication failed' });
  }
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      logger.warn(`Unauthorized access attempt by user: ${req.user?.userId}`);
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }
    next();
  };
};
