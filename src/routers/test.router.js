const express = require('express');
const router = express.Router();
const testController = require('../controllers/test.controller');

router.get('/', testController.getTests);
router.get('/:id', testController.getTestById);

module.exports = router;
