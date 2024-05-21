const express = require('express');
const router = express.Router();
const passport = require('passport');
const partController = require('../controllers/part.controller');
const upload = require('../config/image.config');

router.post('/', upload.single('audio'), partController.addPart);

module.exports = router;
