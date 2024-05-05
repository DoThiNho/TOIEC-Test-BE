require('dotenv').config();
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
var jwt = require('jsonwebtoken');
const User = require('../models/users.model');

function getToken(req) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
}

exports.getUserByToken = async (req, res) => {
  try {
    const tokenFromHeader = getToken(req);
    console.log({ tokenFromHeader });
    if (tokenFromHeader) {
      const decoded = jwt.verify(tokenFromHeader, process.env.JWT_SECRET);
      if (decoded) {
        const user = await User.getUserById(decoded.id);
        res.status(StatusCodes.OK).send({ message: 'Get test successfully', user });
      } else {
        res.status(StatusCodes.UNAUTHORIZED).send({ message: 'Unauthorized' });
      }
    }
  } catch (error) {
    console.log({ error });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error.message
    });
  }
};
