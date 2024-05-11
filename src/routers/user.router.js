const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const upload = require('../config/image.config');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/me', authMiddleware.verifyToken, userController.getUserByToken);
router.post('/me', authMiddleware.verifyToken, userController.updateUser);
router.post(
  '/me/set-avatar',
  authMiddleware.verifyToken,
  upload.single('image'),
  userController.setAvatarUser
);

module.exports = router;
