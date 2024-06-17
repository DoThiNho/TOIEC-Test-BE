require('dotenv').config();
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const { v4: uuid } = require('uuid');
const UserAnswer = require('../models/userAnswers.model');
const Achievement = require('../models/achievements.model');

exports.addUserAnswers = async (req, res) => {
  try {
    const {
      answers,
      complete_time,
      parts,
      start_time,
      test_id,
      total_corrects,
      total_questions,
      user_id,
      type,
      title
    } = req.body;
    const idAchievement = uuid();

    const answersAdd = answers.map((answer) => ({
      question_id: answer.questionId,
      option: answer.option,
      achievement_id: idAchievement,
      id: uuid()
    }));
    const newAchievement = {
      id: idAchievement,
      user_id,
      test_id,
      parts: parts.join(''),
      date: start_time,
      complete_time,
      total_corrects,
      total_questions,
      type,
      title
    };
    await Achievement.create(newAchievement);
    await UserAnswer.create(answersAdd);
    res.status(StatusCodes.CREATED).send({
      status: StatusCodes.OK,
      message: 'User submit successfully',
      data: { ...newAchievement }
    });
  } catch (error) {
    console.log({ error });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};
