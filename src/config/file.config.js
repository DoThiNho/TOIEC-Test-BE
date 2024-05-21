const multer = require('multer');
const { diskStorage } = require('multer');
const path = require('path');

// const maxSize = 1048576 * 10; // 10 MB limit
// const maxSize = 5 * 1024 * 1024;
// const allowedExtensions = ['.png', '.jpg', '.jpeg', '.mp3'];

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/assets/images');
  },
  filename: (req, file, cb) => {
    cb(null, `${uuid()}-${file.originalname}`);
  }
});

// Cấu hình multer cho âm thanh
const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/assets/audio');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  }
});

// const fileFilter = (req, file, cb) => {
//   const extname = path.extname(file.originalname).toLowerCase();
//   if (allowedExtensions.includes(extname)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only .png, .jpg, .jpeg and .mp3 files are allowed!'));
//   }
// };

// const upload = multer({
//   storage: storage,
//   limits: { fieldNameSize: 200, fileSize: maxSize },
//   fileFilter: fileFilter
// });

const imageUpload = multer({ storage: imageStorage });
const audioUpload = multer({ storage: audioStorage });

const upload = multer({ storage: multer.memoryStorage() }).fields([
  { name: 'fileImage', maxCount: 1 },
  { name: 'fileAudio', maxCount: 1 }
]);
module.exports = upload;
