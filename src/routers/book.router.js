const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');
const testController = require('../controllers/test.controller');

router.get('/', bookController.getBooks);
router.get('/:bookId', testController.getTestsByBookId);
router.post('/', bookController.addBook);
router.delete('/:id', bookController.deleteBookById);

module.exports = router;
