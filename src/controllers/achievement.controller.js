require('dotenv').config();
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const { v4: uuid } = require('uuid');
const { getToken } = require('../helpers');
const jwt = require('jsonwebtoken');
const Achievement = require('../models/achievements.model');
const UserAnswer = require('../models/userAnswers.model');
const Question = require('../models/questions.model');
const Test = require('../models/tests.model');
const Book = require('../models/books.model');
const File = require('../models/files.model');

exports.addAchievement = async (req, res) => {
  try {
    const newAchievement = await Achievement.create({
      ...req.body,
      id: uuid()
    });
    res.status(StatusCodes.CREATED).send({
      status: 200,
      message: 'Achievement created successfully'
    });
  } catch (error) {
    console.log({ error });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};

exports.getAchievements = async (req, res) => {
  try {
    const { limit } = req.query;
    const achievements = await Achievement.getAchievements(limit);
    res.status(StatusCodes.OK).send({
      status: StatusCodes.OK,
      message: 'Get list book successfully',
      achievements
    });
  } catch (error) {}
};

exports.getAchievementById = async (req, res) => {
  try {
    const { id } = req.params;
    const achievement = await Achievement.getAchievementById(id);
    let test = await Test.getTestById(achievement[0].test_id);
    const book = await Book.getBookById(test[0].book_id);
    test[0].book_title = book[0].title;

    if (achievement[0]) {
      const parts = achievement[0].parts.split(',');
      const questions = [];
      const answers = [];
      for (const partId of parts) {
        const questionsByPartId = await Question.getQuestionsByPartId(partId);
        questions.push(...questionsByPartId);
        for (question of questionsByPartId) {
          const answer = await UserAnswer.getAnswersByTestIdAndQuestionId(
            question.id,
            achievement[0].id
          );
          answers.push(...answer);
          const file = await File.getFileById(question.file_id);
          question.image = file[0].image;
        }
      }
      res.status(StatusCodes.OK).send({
        message: 'Get result successfully',
        data: {
          results: { ...achievement[0] },
          questions,
          answers,
          test: test[0]
        }
      });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error.message
    });
  }
};

exports.getAchievementsByUserIdAndTestId = async (req, res) => {
  try {
    const tokenFromHeader = getToken(req);
    const decoded = jwt.verify(tokenFromHeader, process.env.JWT_SECRET);
    const { testId } = req.params;
    console.log({ testId });
    const achievements = await Achievement.getAchievementsByUserIdAndTestId(decoded.id, testId);
    res.status(StatusCodes.OK).send({
      status: 200,
      message: 'Get result successfully',
      data: achievements
    });
  } catch (error) {
    console.log({ error });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};
