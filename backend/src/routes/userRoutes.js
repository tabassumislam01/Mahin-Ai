const express = require('express');
const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/profile', async (req, res, next) => {
  try {
    const user = await User.findById(req.user.sub).select('-passwordHash -refreshTokenHash -resetPasswordTokenHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ user });
  } catch (error) {
    return next(error);
  }
});

router.put('/profile', async (req, res, next) => {
  try {
    const updates = {
      ...(typeof req.body.name === 'string' ? { name: req.body.name.slice(0, 120) } : {}),
      ...(typeof req.body.avatarUrl === 'string' ? { avatarUrl: req.body.avatarUrl } : {}),
    };

    const user = await User.findByIdAndUpdate(req.user.sub, { $set: updates }, { new: true }).select(
      '-passwordHash -refreshTokenHash -resetPasswordTokenHash'
    );

    return res.json({ user });
  } catch (error) {
    return next(error);
  }
});

router.delete('/account', async (req, res, next) => {
  try {
    await Conversation.deleteMany({ userId: req.user.sub });
    await Message.deleteMany({ userId: req.user.sub });
    await User.findByIdAndDelete(req.user.sub);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
