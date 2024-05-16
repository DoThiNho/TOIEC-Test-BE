const express = require('express');
const router = express.Router();
const fileController = require('../controllers/file.controller');
// const multer = require('multer');
// const upload = multer({ storage: multer.memoryStorage() });
const upload = require('../config/image.config');

router.post('/', upload.single('image'), fileController.create);
// router.post('/add/audio', upload.single('audio'), fileController.create);

module.exports = router;
