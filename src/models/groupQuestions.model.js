const query = require('../database/db');

const GroupQuestions = function (groupQuestions) {
  this.id = groupQuestions.id;
  this.group_image = groupQuestions.user_id;
  this.group_audio = groupQuestions.title;
};

GroupQuestions.create = (newGroupQuestion) => {
  const sql = 'INSERT INTO group_questions SET ?';
  return query(sql, [newGroupQuestion]);
};

GroupQuestions.getGroupQuestionByPartId = (id) => {
  let sql = `SELECT * FROM group_questions WHERE part_id = ? ORDER BY id ASC`;
  return query(sql, id);
};

GroupQuestions.getGroupQuestionByTestId = (id) => {
  let sql = `SELECT * FROM group_questions WHERE test_id = ?`;
  return query(sql, id);
};

module.exports = GroupQuestions;
