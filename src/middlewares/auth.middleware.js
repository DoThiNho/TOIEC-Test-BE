const jwt = require('jsonwebtoken');
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const User = require('../models/users.model');

exports.loggedin = (req, res, next) => {
  if (req.session?.loggedin) {
    res.locals.user = req.session.user;
    next();
  } else {
    res.redirect(`${process.env.CLIENT_URL}login`);
  }
};

exports.isAuth = (req, res, next) => {
  if (req.session?.loggedin) {
    res.locals.user = req.session.user;
    res.redirect(`${process.env.CLIENT_URL}home`);
  } else {
    next();
  }
};

exports.verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.headers.authorization;
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).send({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.getUserById(decoded.id);
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).send({ message: 'Unauthorized' });
    }

    req.user = user[0];
    next();
  } catch (err) {
    return res.status(StatusCodes.UNAUTHORIZED).send({ message: 'Unauthorized' });
  }
};

exports.authorizeRole = (requiredRoleId) => {
  return (req, res, next) => {
    if (req.user && req.user.role_id === requiredRoleId) {
      return next();
    }
    res.status(StatusCodes.FORBIDDEN).send({ message: 'Forbidden' });
  };
};
