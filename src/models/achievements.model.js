const query = require('../database/db');

const Achievements = function (achievement) {
  this.id = achievement.id;
  this.user_id = achievement.user_id;
  this.test_id = achievement.test_id;
  this.parts = achievement.parts;
  this.start_time = achievement.start_time;
  this.complete_time = achievement.complete_time;
  this.total_corrects = achievement.total_corrects;
  this.total_questions = achievement.total_questions;
};

Achievements.create = (newAchievement) => {
  const sql = 'INSERT INTO achievements SET ?';
  return query(sql, [newAchievement]);
};

Achievements.getAchievements = (searchTerm, page, limit) => {
  let sql = 'SELECT * FROM achievements';
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

Achievements.getAchievementById = (id) => {
  const sql = `SELECT * FROM achievements WHERE id = ?`;
  return query(sql, [id]);
};

Achievements.getAchievementsByUserId = (userId) => {
  const sql = 'SELECT * FROM achievements WHERE user_id = ?';
  return query(sql, [userId]);
};

Achievements.getAchievementsByUserIdAndTestId = (userId, testId) => {
  const sql = 'SELECT * FROM achievements WHERE user_id = ? AND test_id = ? ORDER BY date DESC';
  return query(sql, [userId, testId]);
};

Achievements.deleteAchievementById = (id) => {
  const sql = 'DELETE FROM achievements WHERE id = ?';
  return query(sql, [id]);
};

module.exports = Achievements;
