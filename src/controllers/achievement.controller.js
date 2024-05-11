require('dotenv').config();
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const Achievement = require('../models/achievements.model');
const { v4: uuid } = require('uuid');
const { getToken } = require('../helpers');
const jwt = require('jsonwebtoken');

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

exports.getAchievementsByUserIdAndTestId = async (req, res) => {
  try {
    const tokenFromHeader = getToken(req);
    const decoded = jwt.verify(tokenFromHeader, process.env.JWT_SECRET);
    const { testId } = req.params;
    const achievements = await Achievement.getAchievementsByUserIdAndTestId(decoded.id, testId);
    res.status(StatusCodes.CREATED).send({
      status: 200,
      message: 'Get result successfully',
      data: achievements
    });
  } catch (error) {
    console.log({ error });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};
