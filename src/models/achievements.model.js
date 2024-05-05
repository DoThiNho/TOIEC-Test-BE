const query = require('../database/db');

const Achievements = function (achievement) {
  this.title = book.title;
};

Book.getBooks = (searchTerm, page, limit) => {
  let sql = 'SELECT * FROM book';
  if (searchTerm) {
    sql += ` WHERE title LIKE '%${searchTerm}%'`;
  }
  if (limit && page) {
    const offset = (page - 1) * limit;
    sql += ` LIMIT ${limit} OFFSET ${offset}`;
  } else if (limit) {
    sql += ` LIMIT ${limit}`;
  }
  return query(sql);
};

Book.addBook = async (newBook) => {
  const sql = 'INSERT INTO book SET ?';
  return query(sql, newBook);
};

module.exports = Book;
