const query = require('../database/db');

const Test = function (test) {
  this.id = test.id;
  this.book_id = test.book_id;
  this.title = test.title;
  this.audio_link = test.audio_link;
};

Test.getTests = (searchTerm, page, limit) => {
  let sql = 'SELECT * FROM tests';
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

Test.getTestById = (id) => {
  const sql = `SELECT * FROM tests WHERE id = ?`;
  return query(sql, [id]);
};

Test.getTestsByBookId = (bookId) => {
  const sql = `SELECT * FROM tests WHERE book_id =`;
  return query(sql, [bookId]);
};

Test.create = async (newTest) => {
  const sql = 'INSERT INTO tests SET ?';
  return query(sql, [newTest]);
};

module.exports = Test;
