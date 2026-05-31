import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Conversation title is required'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    default: '',
    maxlength: 500
  },
  aiProvider: {
    type: String,
    enum: ['ollama', 'openai', 'claude'],
    default: 'ollama'
  },
  model: {
    type: String,
    default: process.env.OLLAMA_MODEL || 'qwen2:3b'
  },
  messageCount: { type: Number, default: 0 },
  isArchived: { type: Boolean, default: false },
  isPinned: { type: Boolean, default: false },
  tags: [String],
  totalTokens: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes
conversationSchema.index({ userId: 1, createdAt: -1 });
conversationSchema.index({ userId: 1, isPinned: -1 });
conversationSchema.index({ userId: 1, isArchived: 1 });

export default mongoose.model('Conversation', conversationSchema);
