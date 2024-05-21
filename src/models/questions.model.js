const query = require('../database/db');

const Question = function (question) {
  this.id = question.id;
  this.test_id = question.test_id;
  this.part_id = question.part_id;
  this.question_title = question.question_title;
  this.answer_a = question.answer_a;
  this.answer_b = question.answer_b;
  this.answer_c = question.answer_c;
  this.answer_d = question.answer_d;
  this.correct_answer = question.correct_answer;
};

Question.create = (newAchievement) => {
  const sql = 'INSERT INTO questions SET ?';
  return query(sql, [newAchievement]);
};

Question.getQuestionsByTestId = (testId) => {
  const sql = `SELECT * FROM questions WHERE test_id = ?`;
  return query(sql, [testId]);
};

Question.getQuestionsByGroupId = (groupId) => {
  const sql = `SELECT * FROM questions WHERE group_id = ?`;
  return query(sql, [groupId]);
};

Question.getQuestionsByPartId = (partId) => {
  const sql = `SELECT * FROM questions WHERE part_id = ?`;
  return query(sql, [partId]);
};

module.exports = Question;
