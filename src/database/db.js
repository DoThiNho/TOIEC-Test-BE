const connection = require('../config/db.config');

async function query(sql, params) {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, function (err, result, fields) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

module.exports = query;
