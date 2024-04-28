require('dotenv').config();
const bcrypt = require('bcrypt');
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const User = require('../models/user.model');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);

    if (user) {
      return res
        .status(StatusCodes.CONFLICT)
        .send({ message: 'User with given email already exists!' });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(password, salt);

    await User.create({
      ...req.body,
      password: hashPassword
    });
    res.status(StatusCodes.CREATED).send({ message: 'User created successfully' });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail({ email });

    if (!user) {
      return res.status(StatusCodes.CONFLICT).send({ message: 'Email does not exist!' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword)
      return res.status(StatusCodes.UNAUTHORIZED).send({ message: 'Invalid email or password' });

    req.session.loggedin = true;
    req.session.user = user;
    res.status(StatusCodes.OK).send({
      data: user,
      message: 'Logged in successfully'
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    res.redirect(`${process.env.CLIENT_URL}login`);
  });
};
