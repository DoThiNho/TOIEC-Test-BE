const express = require('express');
const router = express.Router();
const testController = require('../controllers/test.controller');
const userAnswerController = require('../controllers/userAnswer.controller');
const achievementController = require('../controllers/achievement.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../config/audio.config');

router.get('/', testController.getTests);
router.get('/:id', testController.getTestById);
router.post('/', upload.array('file'), testController.addTest);
router.get(
  '/:testId/results',
  authMiddleware.verifyToken,
  achievementController.getAchievementsByUserIdAndTestId
);
router.post('/answers', userAnswerController.addUserAnswers);
router.delete('/:id', testController.deleteTestById);

module.exports = router;
