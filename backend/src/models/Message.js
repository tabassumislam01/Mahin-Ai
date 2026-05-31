import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userMessage: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: 5000
  },
  aiResponse: {
    type: String,
    required: [true, 'AI response is required'],
    maxlength: 20000
  },
  tokens: {
    prompt: { type: Number, default: 0 },
    completion: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  processingTime: Number, // in milliseconds
  model: {
    type: String,
    default: process.env.OLLAMA_MODEL || 'qwen2:3b'
  },
  isEdited: { type: Boolean, default: false },
  isFlagged: { type: Boolean, default: false },
  flagReason: String,
  attachments: [{
    url: String,
    type: String,
    name: String
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ userId: 1, createdAt: -1 });
messageSchema.index({ conversationId: 1, userId: 1 });

export default mongoose.model('Message', messageSchema);
