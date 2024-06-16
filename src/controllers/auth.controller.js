require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { v4: uuid } = require('uuid');
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const User = require('../models/users.model');

exports.register = async (req, res) => {
  try {
    const { email, password, role_id, first_name, last_name, phone_number, image } = req.body;

    const user = await User.findByEmail(email);
    if (user) {
      return res
        .status(StatusCodes.CONFLICT)
        .send({ message: 'User with given email already exists!' });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      ...req.body,
      id: uuid(),
      password: hashPassword,
      register_at: moment().format('YYYY-MM-DD HH:mm')
    });
    const id = uuid();
    res.status(StatusCodes.CREATED).send({
      message: 'User created successfully',
      user: { ...newUser },
      token: jwt.sign(
        {
          id
        },
        process.env.JWT_SECRET,
        { expiresIn: 24 * 60 * 60 }
      )
    });
  } catch (error) {
    console.log({ error });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(StatusCodes.CONFLICT).send({ message: 'Email does not exist!' });
    }
    if (user.password !== '') {
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword)
        return res.status(StatusCodes.UNAUTHORIZED).send({ message: 'Password is incorrect' });
    }

    res.status(StatusCodes.OK).send({
      user,
      token: jwt.sign(
        {
          id: user.id
        },
        process.env.JWT_SECRET,
        { expiresIn: 60 * 60 * 24 }
      ),
      message: 'Logged in successfully'
    });
  } catch (error) {
    console.log({ error });
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
