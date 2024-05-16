require('dotenv').config();
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const { v4: uuid } = require('uuid');
const Book = require('../models/books.model');
const Test = require('../models/tests.model');
const Part = require('../models/parts.model');
const Question = require('../models/questions.model');

exports.addTest = async (req, res) => {
  try {
    const newTest = await Test.create({
      ...req.body,
      id: uuid()
    });
    res
      .status(StatusCodes.CREATED)
      .send({ status: StatusCodes.OK, message: 'Test added successfully' });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error.message });
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
    res.status(StatusCodes.OK).send({ message: 'Get list test successfully', tests });
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
        audio_link: test[0].audio_link
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
    res.status(StatusCodes.OK).send({ message: 'Get list test successfully', tests });
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
    console.log({ tests });
    res.status(StatusCodes.OK).send({ message: 'Get list test successfully', tests });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error.message
    });
  }
};
