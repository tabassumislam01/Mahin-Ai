const express = require('express');
const { z } = require('zod');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { requireAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { sendMessage } = require('../services/chatService');

const router = express.Router();
router.use(requireAuth);

const sendSchema = z.object({
  body: z.object({
    content: z.string().min(1).max(5000),
    conversationId: z.string().optional(),
  }),
  params: z.object({}),
  query: z.object({}),
});

router.post('/message', validate(sendSchema), async (req, res, next) => {
  try {
    const { content, conversationId } = req.validated.body;
    const result = await sendMessage({ userId: req.user.sub, conversationId, content });
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
});

router.get('/conversations', async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ userId: req.user.sub })
      .sort({ isPinned: -1, updatedAt: -1 })
      .limit(100);
    return res.json({ conversations });
  } catch (error) {
    return next(error);
  }
});

router.get('/conversations/:id/messages', async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({ _id: req.params.id, userId: req.user.sub });
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

    const messages = await Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 }).limit(500);
    return res.json({ messages });
  } catch (error) {
    return next(error);
  }
});

router.patch('/conversations/:id', async (req, res, next) => {
  try {
    const updates = {
      ...(typeof req.body.title === 'string' ? { title: req.body.title.slice(0, 200) } : {}),
      ...(typeof req.body.isArchived === 'boolean' ? { isArchived: req.body.isArchived } : {}),
      ...(typeof req.body.isPinned === 'boolean' ? { isPinned: req.body.isPinned } : {}),
    };

    const conversation = await Conversation.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.sub },
      { $set: updates },
      { new: true }
    );

    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });
    return res.json({ conversation });
  } catch (error) {
    return next(error);
  }
});

router.delete('/conversations/:id', async (req, res, next) => {
  try {
    const conversation = await Conversation.findOneAndDelete({ _id: req.params.id, userId: req.user.sub });
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

    await Message.deleteMany({ conversationId: conversation._id });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
