const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievement.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', authMiddleware.verifyToken, achievementController.getAchievements);
router.get('/:id', authMiddleware.verifyToken, achievementController.getAchievementById);
router.post('/', authMiddleware.verifyToken, achievementController.addAchievement);

module.exports = router;
