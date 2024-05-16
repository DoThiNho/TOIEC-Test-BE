require('dotenv').config();
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const File = require('../models/files.model');
const { v4: uuid } = require('uuid');
const fileUpload = require('express-fileupload');
const { cloudinary } = require('../config/cloudinary.config');
// const { initializeApp } = require('firebase/app');
// const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require('firebase/storage');
// const firebaseConfig = require('../config/firebase.config');
// const firebase = require('firebase/app');

//Initialize a firebase application
// firebase.initializeApp(firebaseConfig);

// const storage = getStorage();

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
      console.log({ idFile });
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

// exports.create = async (req, res) => {
//   try {
//     console.log(req.file);
//     const storageRef = ref(storage, req.file.originalname);
//     const metadata = {
//       contentType: req.file.mimetype
//     };
//     const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
//     const downloadURL = await getDownloadURL(snapshot.ref);
//   } catch (error) {
//     return res.status(400).send(error.message);
//   }
// };
