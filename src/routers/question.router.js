const express = require('express');
const router = express.Router();
const questionController = require('../controllers/question.controller');

router.get('/:id', questionController.getQuestionsByPartId);
router.post('/', questionController.addQuestion);

module.exports = router;
