// const query = require('../database/db');
const { cloudinary } = require('../config/cloudinary.config');
const fs = require('fs');

const File = function (file) {
  this.id = user.id;
  this.image = user.image;
  this.audio_link = user.audio_link;
};

// File.create = (newFile) => {
//   const sql = 'INSERT INTO files SET ?';
//   return query(sql, [newFile]);
// };

// File.getFileById = (id) => {
//   const sql = `SELECT * FROM files WHERE id = ?`;
//   return query(sql, [id]);
// };

File.create = async (file) => {
  const { path } = file;
  const fName = file.originalname.split('.')[0];
  const uploadResponse = await cloudinary.uploader.upload(
    path,
    {
      resource_type: 'raw',
      public_id: `AudioUploads/${fName}`
    },
    (err, audio) => {
      if (err) return;

      fs.unlinkSync(path);
      return audio;
    }
  );
  return uploadResponse.url;
};

module.exports = File;
