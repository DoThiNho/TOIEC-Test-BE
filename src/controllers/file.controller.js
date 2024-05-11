require('dotenv').config();
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const File = require('../models/files.model');
const fileUpload = require('express-fileupload');

exports.create = async (req, res) => {
  try {
    const { path: fileStr } = req.file;
    if (fileStr) {
      const uploadResponse = await cloudinary.uploader.upload(fileStr);
    }
    const newFile = await File.create({
      id: uuid(),
      image: uploadResponse.url || '',
      audio_link: ''
    });
    res.status(StatusCodes.OK).send({ message: 'Create file successfully', user: data });
  } catch (error) {
    console.log({ error });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error.message
    });
  }
};
