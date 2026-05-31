import express from 'express';
import User from '../models/User.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();
router.use(requireAuth, requireRole('admin'));

router.get('/analytics', async (_req, res, next) => {
  try {
    const [totalUsers, totalConversations, totalMessages] = await Promise.all([
      User.countDocuments({}),
      Conversation.countDocuments({}),
      Message.countDocuments({}),
    ]);

    const activeUsers = await User.countDocuments({ 
      lastLoginAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } 
    });

    logger.info('✅ Analytics retrieved');
    return res.json({
      success: true,
      analytics: {
        totalUsers,
        activeUsers,
        totalConversations,
        totalMessages,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error(`Analytics error: ${error.message}`);
    return next(error);
  }
});

router.get('/users', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find({})
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments({})
    ]);

    logger.info(`✅ Users list retrieved (page ${page})`);
    return res.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error(`Users list error: ${error.message}`);
    return next(error);
  }
});

router.get('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const [conversationCount, messageCount] = await Promise.all([
      Conversation.countDocuments({ userId: user._id }),
      Message.countDocuments({ userId: user._id })
    ]);

    logger.info(`✅ User details retrieved: ${req.params.id}`);
    return res.json({
      success: true,
      user: {
        ...user.toObject(),
        stats: { conversationCount, messageCount }
      }
    });
  } catch (error) {
    logger.error(`User details error: ${error.message}`);
    return next(error);
  }
});

router.patch('/users/:id/status', async (req, res, next) => {
  try {
    const { isActive } = req.body;
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ success: false, message: 'isActive must be a boolean' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    logger.info(`✅ User status updated: ${req.params.id}`);
    return res.json({ success: true, user });
  } catch (error) {
    logger.error(`User status update error: ${error.message}`);
    return next(error);
  }
});

router.delete('/users/:id', async (req, res, next) => {
  try {
    // Prevent self-deletion
    if (req.params.id === req.user.userId) {
      return res.status(400).json({ success: false, message: 'Cannot delete yourself' });
    }

    await Conversation.deleteMany({ userId: req.params.id });
    await Message.deleteMany({ userId: req.params.id });
    await User.findByIdAndDelete(req.params.id);

    logger.info(`✅ User deleted: ${req.params.id}`);
    return res.status(204).send();
  } catch (error) {
    logger.error(`User deletion error: ${error.message}`);
    return next(error);
  }
});

export default router;
