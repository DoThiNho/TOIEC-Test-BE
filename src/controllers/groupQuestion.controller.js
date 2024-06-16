require('dotenv').config();
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const GroupQuestions = require('../models/groupQuestions.model');
const Question = require('../models/questions.model');
const Part = require('../models/parts.model');
const Test = require('../models/tests.model');
const Book = require('../models/books.model');

const { v4: uuid } = require('uuid');

exports.create = async (req, res) => {
  try {
    const idGroupQuestion = uuid();
    await GroupQuestions.create({
      ...req.body,
      id: idGroupQuestion
    });
    res.status(StatusCodes.OK).send({ message: 'Create Part successfully' });
  } catch (error) {
    console.log({ error });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error.message
    });
  }
};

exports.getGroupQuestionsByPartId = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, part } = req.query;
    let groupQuestions = [];
    let parts = part;
    if (type === 'fulltest') {
      parts = ['1', '2', '3', '4', '5', '6', '7'];
    }
    if (Array.isArray(parts)) {
      for (const partNum of parts) {
        const partDetail = await Part.getPartByPartNumAndTestId(partNum, id);
        const partId = partDetail[0]?.id;
        if (partId) {
          const groupQuestionByPartId = await GroupQuestions.getGroupQuestionByPartId(partId);
          if (groupQuestionByPartId.length > 0) {
            for (const groupQuestion of groupQuestionByPartId) {
              const questionsByGroupId = await Question.getQuestionsByGroupId(groupQuestion.id);
              groupQuestion.questions = [...questionsByGroupId];
              groupQuestion.part_num = partDetail[0].part_num;
              groupQuestions.push(groupQuestion);
            }
          }
        }
      }
    } else {
      const partDetail = await Part.getPartByPartNumAndTestId(parts, id);
      const partId = partDetail[0].id;
      const groupQuestionByPartId = await GroupQuestions.getGroupQuestionByPartId(partId);
      for (const groupQuestion of groupQuestionByPartId) {
        const questionsByGroupId = await Question.getQuestionsByGroupId(groupQuestion.id);
        groupQuestion.questions = [...questionsByGroupId];
        groupQuestion.part_num = partDetail[0].part_num;
        groupQuestions.push(groupQuestion);
      }
    }
    const test = await Test.getTestById(id);
    let book = {};
    if (test[0]) {
      book = await Book.getBookById(test[0].book_id);
    }
    res.status(StatusCodes.OK).send({
      status: StatusCodes.OK,
      message: 'Get list question successfully',
      data: {
        test_title: test[0].title,
        book_title: book[0].title,
        audio_link: test[0].audio_link,
        group_questions: groupQuestions
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};
