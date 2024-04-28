const connection = require('../config/db.config');

const Book = function (book) {
  this.title = book.title;
};

Book.getAllBook = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM book', function (err, result, fields) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

exports.addBook = async (newBook) => {
  return new Promise((resolve, reject) => {
    connection.query('INSERT INTO users SET ?', newBook, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = Book;
