const multer = require('multer');
const { diskStorage } = require('multer');
const path = require('path');

// const maxSize = 1048576 * 10; // 10 MB limit
const maxSize = 5 * 1024 * 1024;
const allowedExtensions = ['.png', '.jpg', '.jpeg'];

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/assets/images');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const extname = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(extname)) {
    cb(null, true);
  } else {
    cb(new Error('Only .png, .jpg, .jpeg files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fieldNameSize: 200, fileSize: maxSize },
  fileFilter: fileFilter
});

module.exports = upload;
