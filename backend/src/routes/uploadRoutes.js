const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/', requireAuth, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'File is required' });

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: 'mahin-ai' }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });

      stream.end(req.file.buffer);
    });

    return res.status(201).json({ url: uploadResult.secure_url, publicId: uploadResult.public_id });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
