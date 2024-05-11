const query = require('../database/db');

const Book = function (book) {
  this.id = book.id;
  this.title = book.title;
};

Book.getBooks = (searchTerm, page, limit) => {
  let sql = 'SELECT * FROM books';
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

Book.getBookById = (id) => {
  const sql = `SELECT * FROM books WHERE id = ?`;
  return query(sql, [id]);
};

Book.addBook = async (newBook) => {
  const sql = 'INSERT INTO books SET ?';
  return query(sql, [newBook]);
};

module.exports = Book;
