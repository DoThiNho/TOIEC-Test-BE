const query = require('../database/db');

const Vocabulary = function (vocabulary) {
  this.id = vocabulary.id;
  this.group_vocabularies_id = vocabulary.user_id;
  this.title = vocabulary.title;
  this.mean = vocabulary.mean;
};

Vocabulary.create = (vocabularies) => {
  const isArray = Array.isArray(vocabularies);
  const values = isArray ? vocabularies : [vocabularies];

  if (!isArray && Object.keys(vocabularies).length === 0) {
    return Promise.reject(new Error('vocabularies should be a non-empty object or array'));
  }

  const sql = `INSERT INTO vocabularies (id, group_vocabularies_id, title, mean) VALUES ?`;

  const params = values.map((vocabulary) => [
    vocabulary.id,
    vocabulary.group_vocabularies_id,
    vocabulary.title,
    vocabulary.mean
  ]);

  return query(sql, [params]);
};

Vocabulary.getVocabulariesByGroupId = (groupId) => {
  let sql = `SELECT * FROM vocabularies WHERE group_vocabularies_id = ?`;
  return query(sql, [groupId]);
};

module.exports = Vocabulary;
