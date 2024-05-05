require('dotenv').config();
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const Test = require('../models/tests.model');
const Part = require('../models/parts.model');
const Question = require('../models/questions.model');

exports.getTests = async (req, res) => {
  try {
    const { search, page, limit } = req.query;
    const tests = await Test.getTests(search, page, limit);
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
    const test = await Test.getTestById(id);
    const parts = await Part.getPartsByTestId(id);
    const questions = [];
    for (const part of parts) {
      const listQuestion = await Question.getQuestionsByPartId(part.id);
      questions.push(...listQuestion);
    }
    console.log({ id, test, parts });
    res
      .status(StatusCodes.OK)
      .send({ message: 'Get test successfully', test: { ...test[0], questions } });
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
