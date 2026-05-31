const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, maxlength: 200 },
    isArchived: { type: Boolean, default: false, index: true },
    isPinned: { type: Boolean, default: false, index: true },
    lastMessageAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

conversationSchema.index({ userId: 1, updatedAt: -1 });
module.exports = mongoose.model('Conversation', conversationSchema);
