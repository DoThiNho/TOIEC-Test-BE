const express = require('express');
const router = express.Router();
const groupQuestionsController = require('../controllers/groupQuestion.controller');

router.get('/:id', groupQuestionsController.getGroupQuestionsByPartId);
router.post('/', groupQuestionsController.create);

module.exports = router;
