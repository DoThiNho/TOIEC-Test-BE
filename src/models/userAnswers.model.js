const query = require('../database/db');

const UserAnswer = function (user_answer) {
  this.id = user_answer.id;
  this.achievement_id = user_answer.achievement_id;
  this.question_id = user_answer.question_id;
  this.option = file.option;
};

UserAnswer.create = (userAnswers) => {
  const isArray = Array.isArray(userAnswers);
  const values = isArray ? userAnswers : [userAnswers];

  if (!isArray && Object.keys(userAnswers).length === 0) {
    return Promise.reject(new Error('userAnswers should be a non-empty object or array'));
  }

  const sql = `INSERT INTO user_answers (id, achievement_id, question_id, \`option\`) VALUES ?`;

  const params = values.map((userAnswer) => [
    userAnswer.id,
    userAnswer.achievement_id,
    userAnswer.question_id,
    userAnswer.option
  ]);

  return query(sql, [params]);
};

UserAnswer.getAnswersByTestIdAndQuestionId = (questionId, achievementId) => {
  const sql = `SELECT * FROM user_answers WHERE question_id = ? and achievement_id = ?`;
  return query(sql, [questionId, achievementId]);
};

module.exports = UserAnswer;
