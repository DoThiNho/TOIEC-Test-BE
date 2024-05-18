require('dotenv').config();
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const File = require('../models/files.model');
const { v4: uuid } = require('uuid');
const fileUpload = require('express-fileupload');
const { cloudinary } = require('../config/cloudinary.config');

exports.create = async (req, res) => {
  try {
    const { path: fileStr } = req.file;
    if (fileStr) {
      const uploadResponse = await cloudinary.uploader.upload(fileStr);
      const idFile = uuid();
      const newFile = await File.create({
        id: idFile,
        image: uploadResponse.url || '',
        audio_link: ''
      });
      res
        .status(StatusCodes.OK)
        .send({ message: 'Create file successfully', data: { ...newFile } });
    }
  } catch (error) {
    console.log({ error });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error.message
    });
  }
};
