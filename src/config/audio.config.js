const multer = require('multer');
const { diskStorage } = require('multer');
const path = require('path');

const allowedMimeTypes = ['.wav', '.mp3'];

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/assets/audios');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const extname = path.extname(file.originalname).toLowerCase();
  if (allowedMimeTypes.includes(extname)) {
    cb(null, true);
  } else {
    cb(new Error('Only .mp3 files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  // limits: { fieldNameSize: 200, fileSize: maxSize },
  fileFilter: fileFilter
});

module.exports = upload;
