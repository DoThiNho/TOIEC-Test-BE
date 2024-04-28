const connection = require('../config/db.config');

const User = function (user) {
  this.first_name = user.first_name;
  this.last_name = user.last_name;
  this.email = user.email;
  this.phone_number = user.phone_number;
  this.password_hash = user.password_hash;
  this.image = user.image;
  this.register_at = user.register_at;
};

User.create = (newUser) => {
  connection.query('INSERT INTO users SET ?', newUser, (err, res) => {
    if (err) {
      console.log('error: ', err);
      return;
    }
    console.log('created user: ', { id: res.insertId, ...newUser });
  });
};

User.findByEmail = (email) => {
  connection.query(`SELECT * from users WHERE email = '${email}'`, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    return result;
  });
};

module.exports = User;
