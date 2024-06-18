require('dotenv').config();
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const { v4: uuid } = require('uuid');
const Book = require('../models/books.model');
const Test = require('../models/tests.model');
const Part = require('../models/parts.model');
const Question = require('../models/questions.model');
const path = require('path');
const { getIo } = require('../config/socketIo.config');

exports.addTest = async (req, res) => {
  try {
    const { title, bookId } = req.body;
    const fileStr = req.files[0].path;
    const fileName = path.basename(fileStr);
    const testId = uuid();
    const newTest = {
      book_id: bookId,
      title,
      audio: fileName,
      id: testId
    };
    const result = await Test.create(newTest);
    if (result) {
      const io = getIo();
      io.emit('add-test', testId);
      res.status(StatusCodes.CREATED).send({
        status: StatusCodes.OK,
        message: 'Test added successfully',
        data: newTest
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error.message || 'Internal Server Error'
    });
  }
};

exports.getTests = async (req, res) => {
  try {
    const { search, page, limit } = req.query;
    const tests = await Test.getTests(search, page, limit);
    for (let test of tests) {
      const book = await Book.getBookById(test.book_id);
      test.book_title = book[0].title;
    }
    res.status(StatusCodes.OK).send({ message: 'Get list test successfully', data: tests });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error.message
    });
  }
};

exports.getTestById = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, part } = req.query;
    const test = await Test.getTestById(id);
    const book = await Book.getBookById(test[0].book_id);
    const parts = await Part.getPartsByTestId(id);
    res.status(StatusCodes.OK).send({
      message: 'Get test successfully',
      data: {
        id: test[0].id,
        title: test[0].title,
        book_title: book[0].title,
        parts,
        audio: test[0].audio
      }
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error.message
    });
  }
};

exports.getTestsByBookId = async (req, res) => {
  try {
    const { bookId } = req.params;
    const tests = await Test.getTestsByBookId(bookId);
    res.status(StatusCodes.OK).send({ message: 'Get list test successfully', data: tests });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error.message
    });
  }
};

exports.getTestsByBookTitle = async (req, res) => {
  try {
    const { search, page, limit } = req.query;
    const tests = await Test.getTests(search, page, limit);
    for (let test of tests) {
      const book = await Book.getBookById(test.book_id);
      test.book_title = book[0].title;
    }
    res.status(StatusCodes.OK).send({ message: 'Get list test successfully', data: tests });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error.message
    });
  }
};

exports.deleteTestById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Test.deleteTestById(id);
    if (result.affectedRows === 0) {
      res.status(StatusCodes.NOT_FOUND).send({
        status: StatusCodes.NOT_FOUND,
        message: 'Book not found'
      });
    } else {
      const io = getIo();
      io.emit('delete-test', id);
      res.status(StatusCodes.OK).send({
        status: StatusCodes.OK,
        message: 'Book deleted successfully'
      });
    }
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: 'Failed to update user' });
  }
};
