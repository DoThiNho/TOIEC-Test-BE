const express = require('express');
const router = express.Router();
const testController = require('../controllers/test.controller');
const userAnswerController = require('../controllers/userAnswer.controller');
const achievementController = require('../controllers/achievement.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', testController.getTests);
router.get('/:id', testController.getTestById);
router.post('/', testController.addTest);
router.get(
  '/:testId/results',
  authMiddleware.verifyToken,
  achievementController.getAchievementsByUserIdAndTestId
);
router.post('/answers', userAnswerController.addUserAnswers);

module.exports = router;
