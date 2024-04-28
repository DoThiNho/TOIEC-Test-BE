const connection = require('../config/db.config');

const Question = function (question) {
  this.partId = question.partId;
  this.questionTitle = question.questionTitle;
  this.image = question.image;
  this.answerA = question.answerA;
  this.answerB = question.answerB;
  this.answerC = question.answerC;
  this.answerD = question.answerD;
  this.correctAnswer = question.correctAnswer;
};

Question.getQuestionsByPartId = (partId) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM question WHERE partId = ${partId}`,
      function (err, result, fields) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

module.exports = Question;
