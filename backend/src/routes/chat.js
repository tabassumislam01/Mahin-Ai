import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { validate, messageValidator } from '../utils/validators.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';
import { chatLimiter } from '../middleware/rateLimiter.js';
import { sendMessage, getConversationHistory, getUserConversations, deleteConversation } from '../services/chatService.js';

const router = express.Router();

router.post('/message', authenticate, chatLimiter, validate(messageValidator), async (req, res, next) => {
  try {
    const { message, conversationId } = req.validatedBody;
    const result = await sendMessage(req.userId, conversationId, message);
    return sendSuccess(res, result, 'Message sent successfully', 201);
  } catch (error) {
    next(error);
  }
});

router.get('/history/:conversationId', authenticate, async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    const result = await getConversationHistory(req.userId, conversationId, parseInt(limit), parseInt(offset));
    return sendPaginated(res, result.messages, result.total, Math.floor(parseInt(offset) / parseInt(limit)) + 1, parseInt(limit), 'Conversation history retrieved');
  } catch (error) {
    if (error.message.includes('not found')) {
      return sendError(res, error.message, 404);
    }
    next(error);
  }
});

router.get('/conversations', authenticate, async (req, res, next) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const result = await getUserConversations(req.userId, parseInt(limit), parseInt(offset));
    return sendPaginated(res, result.conversations, result.total, Math.floor(parseInt(offset) / parseInt(limit)) + 1, parseInt(limit), 'Conversations retrieved');
  } catch (error) {
    next(error);
  }
});

router.delete('/:conversationId', authenticate, async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    await deleteConversation(req.userId, conversationId);
    return sendSuccess(res, null, 'Conversation deleted successfully');
  } catch (error) {
    if (error.message.includes('not found')) {
      return sendError(res, error.message, 404);
    }
    next(error);
  }
});

export default router;
