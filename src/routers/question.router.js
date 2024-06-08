const express = require('express');
const router = express.Router();
const questionController = require('../controllers/question.controller');
const upload = require('../config/file.config');
const uploadExcel = require('../config/excel.config');

router.get('/:id', questionController.getQuestionsByPartId);
// router.post('/', questionController.addQuestions);
router.post('/:id', upload, questionController.updateQuestion);
router.post('/', uploadExcel.single('excel'), questionController.addQuestions);

module.exports = router;
