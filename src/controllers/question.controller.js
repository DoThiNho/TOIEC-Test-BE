require('dotenv').config();
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const Question = require('../models/questions.model');
const File = require('../models/files.model');
const Part = require('../models/parts.model');
const { v4: uuid } = require('uuid');

exports.addQuestion = async (req, res) => {
  try {
    const {
      test_id,
      part_id,
      question_title,
      image,
      answer_a,
      answer_b,
      answer_c,
      answer_d,
      correct_answer
    } = req.body;
    const idFile = uuid();
    await File.create({
      id: idFile,
      image: req.body.image,
      audio_link: ''
    });

    await Question.create({
      test_id,
      part_id,
      question_title,
      answer_a,
      answer_b,
      answer_c,
      answer_d,
      correct_answer,
      file_id: idFile,
      id: uuid()
    });
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
    if (type === 'fulltest') {
      questions = await Question.getQuestionsByTestId(id);
    } else {
      for (const partId of part) {
        const questionsByPartId = await Question.getQuestionsByPartId(partId);
        questions.push(...questionsByPartId);
      }
    }
    for (let question of questions) {
      const fileImgs = [];
      for (let id of question.file_id.split(',')) {
        const file = await File.getFileById(id);
        if (file[0]) {
          fileImgs.push(file[0].image);
        }
      }
      const part = await Part.getPartByPartId(question.part_id);
      question.image = fileImgs.join(',');
      question.part_num = part[0].part_num;
    }
    res.status(StatusCodes.OK).send({
      status: StatusCodes.OK,
      message: 'Get list question successfully',
      data: questions
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};
