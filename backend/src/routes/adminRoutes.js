const express = require('express');
const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth, requireRole('admin'));

router.get('/analytics', async (_req, res, next) => {
  try {
    const [users, conversations, messages] = await Promise.all([
      User.countDocuments({}),
      Conversation.countDocuments({}),
      Message.countDocuments({}),
    ]);

    return res.json({ users, conversations, messages });
  } catch (error) {
    return next(error);
  }
});

router.get('/users', async (_req, res, next) => {
  try {
    const users = await User.find({}).select('-passwordHash -refreshTokenHash -resetPasswordTokenHash').sort({ createdAt: -1 });
    return res.json({ users });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
