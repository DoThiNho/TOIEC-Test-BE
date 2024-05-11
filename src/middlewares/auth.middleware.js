const jwt = require('jsonwebtoken');
const { StatusCodes, getReasonPhrase } = require('http-status-codes');

exports.loggedin = (req, res, next) => {
  if (req.session.loggedin) {
    res.locals.user = req.session.user;
    next();
  } else {
    res.redirect(`${process.env.CLIENT_URL}login`);
  }
};

exports.isAuth = (req, res, next) => {
  if (req.session.loggedin) {
    res.locals.user = req.session.user;
    res.redirect(`${process.env.CLIENT_URL}home`);
  } else {
    next();
  }
};

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.headers.authorization;
  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED).send({ message: 'Unauthorized' });
  }
  try {
    const claims = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(StatusCodes.UNAUTHORIZED).send({ message: 'Unauthorized' });
  }
};
