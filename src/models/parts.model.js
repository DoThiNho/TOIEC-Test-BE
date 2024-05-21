const query = require('../database/db');

const Part = function (part) {
  this.id = part.id;
  this.test_id = part.test_id;
  this.part_num = part.part_num;
  this.type = part.type;
};

Part.getPartByPartId = (id) => {
  const sql = 'SELECT * FROM parts WHERE id = ?';
  return query(sql, [id]);
};

Part.getPartsByTestId = (testId) => {
  const sql = 'SELECT * FROM parts WHERE test_id = ? ORDER BY part_num';
  return query(sql, [testId]);
};

Part.create = (newPart) => {
  const sql = 'INSERT INTO parts SET ?';
  return query(sql, [newPart]);
};

Part.getPartByPartNumAndTestId = (part_num, testId) => {
  const sql = 'SELECT * FROM parts WHERE part_num = ? AND test_id = ?';
  return query(sql, [part_num, testId]);
};

module.exports = Part;
