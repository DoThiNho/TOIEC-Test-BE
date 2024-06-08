const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const upload = require('../config/image.config');
const authMiddleware = require('../middlewares/auth.middleware');

router.get(
  '/',
  authMiddleware.verifyToken,
  authMiddleware.authorizeRole('1'),
  userController.getUsers
);
router.get('/me', authMiddleware.verifyToken, userController.getUserByToken);
router.put('/me', authMiddleware.verifyToken, userController.updateUser);
router.get('/:id', authMiddleware.verifyToken, userController.getUserById);
router.post(
  '/me/set-avatar',
  authMiddleware.verifyToken,
  upload.single('image'),
  userController.setAvatarUser
);
router.delete('/:id', authMiddleware.verifyToken, userController.deleteUserById);
module.exports = router;
