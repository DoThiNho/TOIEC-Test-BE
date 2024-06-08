const query = require('../database/db');

const User = function (user) {
  this.id = user.id;
  this.first_name = user.first_name;
  this.last_name = user.last_name;
  this.email = user.email;
  this.phone_number = user.phone_number;
  this.password_hash = user.password_hash;
  this.image = user.image;
  this.register_at = user.register_at;
};

User.create = (newUser) => {
  const sql = 'INSERT INTO users SET ?';
  return query(sql, [newUser]);
};

User.findByEmail = async (email) => {
  const sql = 'SELECT * from users WHERE email = ?';
  const result = await query(sql, [email]);
  return result[0];
};

User.getUsers = () => {
  const sql = `SELECT * FROM users`;
  return query(sql);
};

User.getUserById = (id) => {
  const sql = `SELECT * FROM users WHERE id = ?`;
  return query(sql, [id]);
};

User.updateUserById = (userData) => {
  const { id, first_name, last_name, email, phone_number, image } = userData;
  const sql = `UPDATE users SET first_name = ?, last_name = ?, email = ?, phone_number = ?, image = ? WHERE id = ?`;
  return query(sql, [first_name, last_name, email, phone_number, image, id]);
};

User.setAvatarUser = (image, id) => {
  const sql = 'UPDATE users SET image = ? WHERE id = ?';
  return query(sql, [image, id]);
};

User.deleteUserById = (id) => {
  const sql = 'DELETE FROM users WHERE id = ?';
  return query(sql, [id]);
};

module.exports = User;
