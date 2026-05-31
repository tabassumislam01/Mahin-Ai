const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const createProvider = require('./ai');

const provider = createProvider();

async function sendMessage({ userId, conversationId, content }) {
  let conversation = conversationId
    ? await Conversation.findOne({ _id: conversationId, userId })
    : await Conversation.create({ userId, title: content.slice(0, 40) || 'New Conversation' });

  if (!conversation) throw new Error('Conversation not found');

  const userMessage = await Message.create({ conversationId: conversation._id, userId, role: 'user', content });
  const history = await Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 }).lean();

  const aiContent = await provider.chat(
    history.map((m) => ({ role: m.role, content: m.content }))
  );

  const assistantMessage = await Message.create({
    conversationId: conversation._id,
    userId,
    role: 'assistant',
    content: aiContent,
  });

  conversation.lastMessageAt = new Date();
  await conversation.save();

  return {
    conversation,
    userMessage,
    assistantMessage,
  };
}

module.exports = { sendMessage };
