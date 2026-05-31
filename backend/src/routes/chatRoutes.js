import express from 'express';
import { z } from 'zod';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { requireAuth } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { sendMessage } from '../services/chatService.js';
import { logger } from '../utils/logger.js';

const router = express.Router();
router.use(requireAuth);

const sendMessageSchema = z.object({
  body: z.object({
    content: z.string().min(1).max(5000),
    conversationId: z.string().optional(),
  }),
  params: z.object({}),
  query: z.object({}),
});

const updateConversationSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    isArchived: z.boolean().optional(),
    isPinned: z.boolean().optional(),
  }),
  params: z.object({ id: z.string() }),
  query: z.object({}),
});

router.post('/message', validate(sendMessageSchema), async (req, res, next) => {
  try {
    const { content, conversationId } = req.validated.body;
    const result = await sendMessage(req.user.userId, conversationId, content);
    return res.status(201).json({ success: true, ...result });
  } catch (error) {
    logger.error(`Send message error: ${error.message}`);
    return next(error);
  }
});

router.get('/conversations', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [conversations, total] = await Promise.all([
      Conversation.find({ userId: req.user.userId })
        .sort({ isPinned: -1, updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Conversation.countDocuments({ userId: req.user.userId })
    ]);

    logger.info(`✅ Conversations retrieved: ${conversations.length}`);
    return res.json({
      success: true,
      conversations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error(`Conversations list error: ${error.message}`);
    return next(error);
  }
});

router.get('/conversations/:id', async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    logger.info(`✅ Conversation retrieved: ${req.params.id}`);
    return res.json({ success: true, conversation });
  } catch (error) {
    logger.error(`Conversation fetch error: ${error.message}`);
    return next(error);
  }
});

router.get('/conversations/:id/messages', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const [messages, total] = await Promise.all([
      Message.find({ conversationId: conversation._id })
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Message.countDocuments({ conversationId: conversation._id })
    ]);

    logger.info(`✅ Messages retrieved: ${messages.length}`);
    return res.json({
      success: true,
      messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error(`Messages fetch error: ${error.message}`);
    return next(error);
  }
});

router.patch('/conversations/:id', validate(updateConversationSchema), async (req, res, next) => {
  try {
    const updates = {};

    if (typeof req.validated.body.title === 'string') {
      updates.title = req.validated.body.title;
    }
    if (typeof req.validated.body.isArchived === 'boolean') {
      updates.isArchived = req.validated.body.isArchived;
    }
    if (typeof req.validated.body.isPinned === 'boolean') {
      updates.isPinned = req.validated.body.isPinned;
    }

    const conversation = await Conversation.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    logger.info(`✅ Conversation updated: ${req.params.id}`);
    return res.json({ success: true, conversation });
  } catch (error) {
    logger.error(`Conversation update error: ${error.message}`);
    return next(error);
  }
});

router.delete('/conversations/:id', async (req, res, next) => {
  try {
    const conversation = await Conversation.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    await Message.deleteMany({ conversationId: conversation._id });

    logger.info(`✅ Conversation deleted: ${req.params.id}`);
    return res.status(204).send();
  } catch (error) {
    logger.error(`Conversation deletion error: ${error.message}`);
    return next(error);
  }
});

export default router;
