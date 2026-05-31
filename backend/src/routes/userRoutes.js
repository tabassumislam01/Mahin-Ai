import express from 'express';
import User from '../models/User.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { requireAuth } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();
router.use(requireAuth);

router.get('/profile', async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      logger.warn(`User not found: ${req.user.userId}`);
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.json({ success: true, user });
  } catch (error) {
    logger.error(`Profile fetch error: ${error.message}`);
    return next(error);
  }
});

router.put('/profile', async (req, res, next) => {
  try {
    const updates = {};
    
    if (typeof req.body.name === 'string' && req.body.name.trim()) {
      updates.name = req.body.name.slice(0, 120).trim();
    }
    if (typeof req.body.avatar === 'string') {
      updates.avatar = req.body.avatar;
    }
    if (typeof req.body.bio === 'string') {
      updates.bio = req.body.bio.slice(0, 500);
    }
    if (req.body.settings && typeof req.body.settings === 'object') {
      updates.settings = req.body.settings;
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    logger.info(`✅ User profile updated: ${req.user.userId}`);
    return res.json({ success: true, user });
  } catch (error) {
    logger.error(`Profile update error: ${error.message}`);
    return next(error);
  }
});

router.delete('/account', async (req, res, next) => {
  try {
    // Delete all user data
    await Conversation.deleteMany({ userId: req.user.userId });
    await Message.deleteMany({ userId: req.user.userId });
    await User.findByIdAndDelete(req.user.userId);
    
    logger.info(`✅ User account deleted: ${req.user.userId}`);
    return res.status(204).send();
  } catch (error) {
    logger.error(`Account deletion error: ${error.message}`);
    return next(error);
  }
});

router.get('/stats', async (req, res, next) => {
  try {
    const [conversationCount, messageCount] = await Promise.all([
      Conversation.countDocuments({ userId: req.user.userId }),
      Message.countDocuments({ userId: req.user.userId })
    ]);

    return res.json({
      success: true,
      stats: {
        conversationCount,
        messageCount,
        joinedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error(`Stats fetch error: ${error.message}`);
    return next(error);
  }
});

export default router;
