const query = require('../database/db');

const GroupVocabulary = function (vocabularies) {
  this.id = vocabularies.id;
  this.user_id = vocabularies.user_id;
  this.title = vocabularies.title;
  this.description = vocabularies.description;
};

GroupVocabulary.create = (newGroupVocabulary) => {
  const sql = 'INSERT INTO group_vocabularies SET ?';
  return query(sql, [newGroupVocabulary]);
};

GroupVocabulary.getGroupVocabularies = () => {
  const sql = 'SELECT * FROM group_vocabularies';
  return query(sql);
};

GroupVocabulary.getGroupVocabularyByUserId = (userId) => {
  let sql = `SELECT * FROM group_vocabularies WHERE user_id = ?`;
  return query(sql);
};

module.exports = GroupVocabulary;
