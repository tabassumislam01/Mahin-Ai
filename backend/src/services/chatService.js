import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { generateAIResponse } from '../config/ollama.js';
import { logger } from '../utils/logger.js';
import { cacheSet, cacheGet, cacheDel } from '../config/redis.js';

export const sendMessage = async (userId, conversationId, userMessage) => {
  try {
    let conversation;

    // Find or create conversation
    if (conversationId) {
      conversation = await Conversation.findOne({ _id: conversationId, userId });
      if (!conversation) {
        throw new Error('Conversation not found');
      }
    } else {
      // Create new conversation with auto-generated title
      const title = userMessage.substring(0, 100) || 'New Conversation';
      conversation = new Conversation({
        userId,
        title,
        aiProvider: 'ollama',
        model: process.env.OLLAMA_MODEL || 'qwen2:3b',
      });
      await conversation.save();
    }

    // Get recent messages for context
    const recentMessages = await Message.find({ conversationId: conversation._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Build messages array for AI
    const messages = [
      ...recentMessages.reverse().map(m => ({
        role: 'user',
        content: m.userMessage
      })),
      ...recentMessages.reverse().map(m => ({
        role: 'assistant',
        content: m.aiResponse
      })),
      { role: 'user', content: userMessage }
    ];

    // Get AI response
    const startTime = Date.now();
    const aiResponse = await generateAIResponse(messages);
    const processingTime = Date.now() - startTime;

    // Create and save message
    const message = new Message({
      conversationId: conversation._id,
      userId,
      userMessage,
      aiResponse,
      processingTime,
      model: process.env.OLLAMA_MODEL || 'qwen2:3b',
    });

    await message.save();

    // Update conversation
    conversation.messageCount = (conversation.messageCount || 0) + 1;
    conversation.updatedAt = new Date();
    await conversation.save();

    // Invalidate cache
    await cacheDel(`conversation:${conversation._id}:messages`);
    await cacheDel(`user:${userId}:conversations`);

    logger.info(`✅ Message saved for conversation: ${conversation._id}`);

    return {
      messageId: message._id,
      conversationId: conversation._id,
      userMessage,
      aiResponse,
      processingTime,
      timestamp: message.createdAt,
    };
  } catch (error) {
    logger.error(`❌ Send message error: ${error.message}`);
    throw error;
  }
};

export const getConversationHistory = async (userId, conversationId, limit = 50, offset = 0) => {
  try {
    const conversation = await Conversation.findOne({ _id: conversationId, userId });
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Try to get from cache
    const cacheKey = `conversation:${conversationId}:messages:${offset}:${limit}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean();

    const total = await Message.countDocuments({ conversationId });

    const result = {
      conversationId,
      messages: messages.reverse(),
      total,
      hasMore: offset + limit < total,
    };

    // Cache result
    await cacheSet(cacheKey, result, 3600);

    return result;
  } catch (error) {
    logger.error(`❌ Get history error: ${error.message}`);
    throw error;
  }
};

export const getUserConversations = async (userId, limit = 20, offset = 0) => {
  try {
    // Try to get from cache
    const cacheKey = `user:${userId}:conversations:${offset}:${limit}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    const conversations = await Conversation.find({ userId })
      .sort({ updatedAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean();

    const total = await Conversation.countDocuments({ userId });

    const result = {
      conversations,
      total,
      hasMore: offset + limit < total,
    };

    // Cache result
    await cacheSet(cacheKey, result, 1800);

    return result;
  } catch (error) {
    logger.error(`❌ Get conversations error: ${error.message}`);
    throw error;
  }
};

export const deleteConversation = async (userId, conversationId) => {
  try {
    const conversation = await Conversation.findOne({ _id: conversationId, userId });
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Delete all messages in conversation
    await Message.deleteMany({ conversationId });

    // Delete conversation
    await Conversation.deleteOne({ _id: conversationId });

    // Invalidate cache
    await cacheDel(`conversation:${conversationId}:messages`);
    await cacheDel(`user:${userId}:conversations`);

    logger.info(`✅ Conversation deleted: ${conversationId}`);

    return true;
  } catch (error) {
    logger.error(`❌ Delete conversation error: ${error.message}`);
    throw error;
  }
};
