const multer = require('multer');
const { diskStorage } = require('multer');
const path = require('path');

const maxSize = 1048576 * 10; // 10 MB limit
const allowedExtensions = ['.png', '.jpg', '.jpeg', '.mp3'];

const storage = diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const extname = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(extname)) {
    cb(null, true);
  } else {
    cb(new Error('Only .png, .jpg, .jpeg and .mp3 files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: fileFilter
});

module.exports = upload;
