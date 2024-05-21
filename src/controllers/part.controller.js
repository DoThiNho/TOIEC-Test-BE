require('dotenv').config();
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const File = require('../models/files.model');
const Part = require('../models/parts.model');
const { v4: uuid } = require('uuid');
const fileUpload = require('express-fileupload');
const { cloudinary } = require('../config/cloudinary.config');
const storage = require('../config/firebase.config');
const { ref, getDownloadURL, uploadBytes } = require('firebase/storage');
const fs = require('fs');
exports.addPart = async (req, res) => {
  try {
    await Part.create({
      ...req.body,
      id: uuid()
    });
    res.status(StatusCodes.OK).send({ message: 'Create Part successfully' });
  } catch (error) {
    console.log({ error });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error.message
    });
  }
};
