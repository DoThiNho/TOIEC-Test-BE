const query = require('../database/db');

const Achievements = function (achievement) {
  this.id = achievement.id;
  this.user_id = achievement.user_id;
  this.test_id = achievement.test_id;
  this.parts = achievement.parts;
  this.start_time = achievement.start_time;
  this.complete_time = achievement.complete_time;
  this.total_correct = achievement.total_correct;
  this.total_questions = achievement.total_questions;
};

Achievements.create = (newAchievement) => {
  const sql = 'INSERT INTO achievements SET ?';
  return query(sql, [newAchievement]);
};

Achievements.getAchievementsByUserIdAndTestId = (userId, testId) => {
  const sql = 'SELECT * FROM achievements WHERE user_id = ? AND test_id = ?';
  return query(sql, [userId, testId]);
};

module.exports = Achievements;
