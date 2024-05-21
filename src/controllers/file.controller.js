require('dotenv').config();
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const File = require('../models/files.model');
const { v4: uuid } = require('uuid');
const fileUpload = require('express-fileupload');
const { cloudinary } = require('../config/cloudinary.config');
const storage = require('../config/firebase.config');
const { ref, getDownloadURL, uploadBytes } = require('firebase/storage');
const fs = require('fs');
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

exports.createAudio = async (req, res) => {
  try {
    const { path } = req.file;

    const fName = req.file.originalname.split('.')[0];
    cloudinary.uploader.upload(
      path,
      {
        resource_type: 'raw',
        public_id: `AudioUploads/${fName}`
      },
      (err, audio) => {
        if (err) return res.send(err);

        fs.unlinkSync(path);
        res.send(audio);
      }
    );
  } catch (error) {
    console.log({ error });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error.message
    });
  }
};
