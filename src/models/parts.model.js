const connection = require('../config/db.config');

const Part = function (part) {
  this.id = part.id;
  this.test_id = part.test_id;
  this.part_num = part.part_num;
  this.type = part.type;
  this.audio_link = part.audio_link;
};

Part.getPartsByTestId = (testId) => {
  const sql = `SELECT * FROM part WHERE test_id`;
  return query(sql), [testId];
};

module.exports = Part;
