const multer = require('multer');
const { diskStorage } = require('multer');
const path = require('path');

const allowedExtensions = ['.xlsx', '.xls'];

const storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/assets/excels');
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
    cb(new Error('.xlsx and .xls files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

module.exports = upload;
