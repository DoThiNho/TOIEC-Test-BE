const connection = require('../config/db.config');

const Question = function (question) {
  this.id = question.id;
  this.part_id = question.part_id;
  this.question_title = question.question_title;
  this.image = question.image;
  this.answer_a = question.answer_a;
  this.answer_b = question.answer_b;
  this.answer_c = question.answer_c;
  this.answer_d = question.answer_d;
  this.correct_answer = question.correct_answer;
};

Question.getQuestionsByPartId = (partId) => {
  const sql = `SELECT * FROM question WHERE part_id`;
  return query(sql, [partId]);
};

module.exports = Question;
