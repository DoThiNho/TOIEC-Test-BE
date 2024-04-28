const connection = require('../config/db.config');

const Test = function (test) {
  this.bookId = test.bookId;
  this.title = test.title;
  this.audioLink = test.audioLink;
};

Test.getAllTest = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM test', function (err, result, fields) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

Test.getTestById = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM test WHERE id = ${id}`, function (err, result, fields) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

Test.getTestsByBookId = (bookId) => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM test WHERE bookId = ${bookId}`, function (err, result, fields) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = Test;
