const express = require('express');
const router = express.Router();
const questionController = require('../controllers/question.controller');
const upload = require('../config/file.config');

router.get('/:id', questionController.getQuestionsByPartId);
router.post('/', upload, questionController.addQuestion);

module.exports = router;
