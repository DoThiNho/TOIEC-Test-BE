require('dotenv').config();
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const { v4: uuid } = require('uuid');
const { getToken } = require('../helpers');
const jwt = require('jsonwebtoken');
const Achievement = require('../models/achievements.model');
const UserAnswer = require('../models/userAnswers.model');
const Question = require('../models/questions.model');
const GroupQuestions = require('../models/groupQuestions.model');
const Test = require('../models/tests.model');
const Book = require('../models/books.model');
const File = require('../models/files.model');
const Part = require('../models/parts.model');

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
    const { search, page, limit } = req.query;
    const achievements = await Achievement.getAchievements(search, page, limit);
    res.status(StatusCodes.OK).send({
      status: StatusCodes.OK,
      message: 'Get list book successfully',
      data: achievements
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
      let groupQuestions = [];
      for (const partNum of parts) {
        const partDetail = await Part.getPartByPartNumAndTestId(partNum, test[0].id);
        const partId = partDetail[0]?.id;
        const questionsByPartNumTestId = await Question.getQuestionsByPartId(partId);
        questionsByPartNumTestId.forEach((element) => {
          element.part_num = partDetail[0].part_num;
        });
        questions.push(...questionsByPartNumTestId);
        const listGroupQuestion = await GroupQuestions.getGroupQuestionByPartId(partId);
        for (const groupQuestion of listGroupQuestion) {
          const questionsByGroupId = await Question.getQuestionsByGroupId(groupQuestion.id);
          groupQuestion.questions = [...questionsByGroupId];
          groupQuestion.part_num = partDetail[0].part_num;
          groupQuestions.push(groupQuestion);
        }
        for (question of questionsByPartNumTestId) {
          const answer = await UserAnswer.getAnswersByTestIdAndQuestionId(
            question.id,
            achievement[0].id
          );
          answers.push(...answer);
        }
      }
      res.status(StatusCodes.OK).send({
        message: 'Get result successfully',
        data: {
          results: { ...achievement[0] },
          questions,
          groupQuestions,
          answers,
          test: test[0]
        }
      });
    }
  } catch (error) {
    console.log({ error });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error.message
    });
  }
};

exports.getAchievementsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const achievements = await Achievement.getAchievementsByUserId(userId);
    for (achievement of achievements) {
      let test = await Test.getTestById(achievement.test_id);
      const book = await Book.getBookById(test[0].book_id);
      achievement.test_title = test[0].title;
      achievement.book_title = book[0].title;
    }
    res.status(StatusCodes.OK).send({
      status: 200,
      message: 'Get result successfully',
      data: achievements
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};

exports.getAchievementsByUserIdAndTestId = async (req, res) => {
  try {
    const tokenFromHeader = getToken(req);
    const decoded = jwt.verify(tokenFromHeader, process.env.JWT_SECRET);
    const { testId } = req.params;
    const achievements = await Achievement.getAchievementsByUserIdAndTestId(decoded.id, testId);
    res.status(StatusCodes.OK).send({
      status: 200,
      message: 'Get result successfully',
      data: achievements
    });
  } catch (error) {
    consol.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};

exports.deleteAchievementById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Achievement.deleteAchievementById(id);
    if (result.affectedRows === 0) {
      res.status(StatusCodes.NOT_FOUND).send({
        status: StatusCodes.NOT_FOUND,
        message: 'Achievement not found'
      });
    } else {
      res.status(StatusCodes.OK).send({
        status: StatusCodes.OK,
        message: 'Achievement deleted successfully'
      });
    }
  } catch (error) {
    console.error('Error updating achievement:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: 'Failed to update user' });
  }
};
