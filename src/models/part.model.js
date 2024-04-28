const connection = require('../config/db.config');

const Part = function (test) {
  this.testId = test.testId;
  this.partNum = test.partNum;
  this.type = test.type;
  this.audioLink = test.audioLink;
};

Part.getPartsByTestId = (testId) => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM part WHERE testId = ${testId}`, function (err, result, fields) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = Part;
