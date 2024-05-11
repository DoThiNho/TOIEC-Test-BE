const query = require('../database/db');

const File = function (file) {
  this.id = user.id;
  this.image = user.image;
  this.audio_link = user.audio_link;
};

File.create = (newFile) => {
  const sql = 'INSERT INTO files SET ?';
  return query(sql, [newFile]);
};

File.getFileById = (id) => {
  const sql = `SELECT * FROM files WHERE id = ?`;
  return query(sql, [id]);
};

module.exports = File;
