const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievement.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', achievementController.getAchievements);
router.get('/:id', achievementController.getAchievementById);
router.post('/', achievementController.addAchievement);

module.exports = router;
