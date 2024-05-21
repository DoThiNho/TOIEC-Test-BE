require('dotenv').config();
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const Question = require('../models/questions.model');
const File = require('../models/files.model');
const Part = require('../models/parts.model');
const Test = require('../models/tests.model');
const Book = require('../models/books.model');
const { v4: uuid } = require('uuid');

exports.addQuestion = async (req, res) => {
  try {
    const {
      test_id,
      part_id,
      question_title,
      answer_a,
      answer_b,
      answer_c,
      answer_d,
      correct_answer,
      image,
      audio,
      order,
      group_id
    } = req.body;
    // const fileImage = req.files.fileImage ? req.files.fileImage[0] : null;
    // const fileAudio = req.files.fileAudio ? req.files.fileAudio[0] : null;
    const newQuestion = {
      test_id: req.body.test_id,
      part_id,
      question_title,
      answer_a,
      answer_b,
      answer_c,
      answer_d,
      correct_answer,
      image,
      audio,
      order,
      group_id,
      id: uuid()
    };
    await Question.create(newQuestion);
    res.status(StatusCodes.CREATED).send({
      status: 200,
      message: 'Question created successfully'
    });
  } catch (error) {
    console.log({ error });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};

exports.getQuestionsByPartId = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, part } = req.query;
    let questions = [];
    let parts = part;
    if (type === 'fulltest') {
      parts = ['1', '2', '3', '4', '5', '6', '7'];
    }
    if (Array.isArray(parts)) {
      for (const partNum of parts) {
        const partDetail = await Part.getPartByPartNumAndTestId(partNum, id);
        const partId = partDetail[0]?.id;
        const questionsByPartNumTestId = await Question.getQuestionsByPartId(partId);
        questionsByPartNumTestId.forEach((element) => {
          element.part_num = partDetail[0].part_num;
        });
        questions.push(...questionsByPartNumTestId);
      }
    } else {
      const partDetail = await Part.getPartByPartNumAndTestId(parts, id);
      const partId = partDetail[0].id;
      const questionsByPartId = await Question.getQuestionsByPartId(partId);
      questionsByPartId.forEach((element) => {
        element.part_num = partDetail[0].part_num;
      });
      questions.push(...questionsByPartId);
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
        questions
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};
