const express = require('express');
const router = express.Router();
const vocabularyController = require('../controllers/vocabulary.controller');

router.get('/', vocabularyController.getGroupVocabularies);
router.get('/:groupId', vocabularyController.getVocabulariesByGroupId);
router.post('/group-vocabulary', vocabularyController.addGroupVocabulary);
router.post('/', vocabularyController.addVocabularies);

module.exports = router;
