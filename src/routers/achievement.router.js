const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievement.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get(
  '/:testId',
  authMiddleware.verifyToken,
  achievementController.getAchievementsByUserIdAndTestId
);
router.post('/add', achievementController.addAchievement);

module.exports = router;
