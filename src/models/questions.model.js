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

Question.create = (questions) => {
  const isArray = Array.isArray(questions);
  const values = isArray ? questions : [questions];

  if (!isArray && Object.keys(questions).length === 0) {
    return Promise.reject(new Error('questions should be a non-empty object or array'));
  }

  const sql = `
      INSERT INTO questions 
        (test_id, part_id, question_title, answer_a, answer_b, answer_c, answer_d, correct_answer, image, audio, \`order\`, group_id, id) 
      VALUES 
        ?`;
  const params = values.map((question) => [
    question.test_id,
    question.part_id,
    question.question_title,
    question.answer_a,
    question.answer_b,
    question.answer_c,
    question.answer_d,
    question.correct_answer,
    question.image,
    question.audio,
    question.order,
    question.group_id,
    question.id
  ]);

  return query(sql, [params]);
};

Question.update = (id, updatedFields) => {
  const sql = 'UPDATE questions SET ? WHERE id = ?';
  return query(sql, [updatedFields, id]);
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
  const sql = `SELECT * FROM questions WHERE part_id = ? ORDER BY \`order\` ASC`;
  return query(sql, [partId]);
};

module.exports = Question;
