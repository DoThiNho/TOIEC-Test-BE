const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configure storage for images
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/assets/images');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

// Configure storage for audio files
const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/assets/audios');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

// Set up multer instances for image and audio uploads with file filters
const imageUpload = multer({
  storage: imageStorage,
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.png', '.jpg', '.jpeg'];
    const extname = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(extname)) {
      cb(null, true);
    } else {
      cb(new Error('Only .png, .jpg, .jpeg files are allowed for images!'));
    }
  }
});

const audioUpload = multer({
  storage: audioStorage,
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.mp3', '.wav'];
    const extname = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(extname)) {
      cb(null, true);
    } else {
      cb(new Error('Only .mp3, .wav files are allowed for audio!'));
    }
  }
});

// Middleware to handle multiple file uploads with different fields
const upload = multer().fields([
  { name: 'fileImage', maxCount: 1, storage: imageUpload.storage },
  { name: 'fileAudio', maxCount: 1, storage: audioUpload.storage }
]);

module.exports = upload;
