require('dotenv').config();
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const { v4: uuid } = require('uuid');
const { getToken } = require('../helpers');
const jwt = require('jsonwebtoken');
const GroupVocabulary = require('../models/groupVocabulary.model');
const Vocabulary = require('../models/vocabularies.model');

exports.addGroupVocabulary = async (req, res) => {
  try {
    const { vocabularies, title, description, user_id } = req.body;
    const groupVocabularyId = uuid();
    const vocabulariesAdd = vocabularies.map((vocabulary) => ({
      ...vocabulary,
      id: uuid(),
      group_vocabularies_id: groupVocabularyId
    }));
    const newGroupVocabulary = await GroupVocabulary.create({
      id: groupVocabularyId,
      user_id,
      title,
      description
    });
    if (newGroupVocabulary && newGroupVocabulary.affectedRows === 1) {
      await Vocabulary.create(vocabulariesAdd);
      res.status(StatusCodes.CREATED).send({
        status: 200,
        message: 'Achievement created successfully'
      });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        status: 500,
        message: 'Failed to create achievement'
      });
    }
  } catch (error) {
    console.log({ error });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};

exports.addVocabularies = async (req, res) => {
  try {
    const vocabulariesAdd = {
      ...req.body,
      id: uuid()
    };
    await Vocabulary.create(vocabulariesAdd);
    res.status(StatusCodes.CREATED).send({
      status: 200,
      message: 'Achievement created successfully'
    });
  } catch (error) {
    console.log({ error });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};

exports.getGroupVocabularies = async (req, res) => {
  try {
    const groupVocabularies = await GroupVocabulary.getGroupVocabularies();
    res.status(StatusCodes.OK).send({
      status: StatusCodes.OK,
      message: 'Get list group vocabularies successfully',
      data: [...groupVocabularies]
    });
  } catch (error) {}
};

exports.getVocabulariesByGroupId = async (req, res) => {
  try {
    const { groupId } = req.params;
    const vocabularies = await Vocabulary.getVocabulariesByGroupId(groupId);
    console.log({ vocabularies });
    res.status(StatusCodes.OK).send({
      message: 'Get vocabularies successfully',
      vocabularies: [...vocabularies]
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error.message
    });
  }
};
