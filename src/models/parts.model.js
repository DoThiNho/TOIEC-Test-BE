const query = require('../database/db');

const Part = function (part) {
  this.id = part.id;
  this.test_id = part.test_id;
  this.part_num = part.part_num;
  this.type = part.type;
  this.audio_link = part.audio_link;
};

Part.getPartByPartId = (id) => {
  const sql = 'SELECT * FROM parts WHERE id = ?';
  return query(sql, [id]);
};

Part.getPartsByTestId = (testId) => {
  const sql = 'SELECT * FROM parts WHERE test_id = ?';
  return query(sql, [testId]);
};

module.exports = Part;
