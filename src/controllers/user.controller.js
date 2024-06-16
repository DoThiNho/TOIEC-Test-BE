require('dotenv').config();
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const User = require('../models/users.model');
const File = require('../models/files.model');
const fileUpload = require('express-fileupload');
const { v4: uuid } = require('uuid');
const { cloudinary } = require('../config/cloudinary.config');
const { getToken } = require('../helpers');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.getUsers();
    res
      .status(StatusCodes.OK)
      .send({ status: StatusCodes.OK, message: 'Get test successfully', data: users });
  } catch (error) {
    console.log({ error });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error.message
    });
  }
};

exports.getUserByToken = async (req, res) => {
  try {
    const tokenFromHeader = getToken(req);
    if (tokenFromHeader) {
      const decoded = jwt.verify(tokenFromHeader, process.env.JWT_SECRET);
      if (decoded) {
        const user = await User.getUserById(decoded.id);
        const data = {
          id: user[0].id,
          firstName: user[0].first_name,
          lastName: user[0].last_name,
          email: user[0].email,
          phoneNumber: user[0].phone_number,
          image: user[0].image
        };
        res
          .status(StatusCodes.OK)
          .send({ status: StatusCodes.OK, message: 'Get test successfully', data: data });
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

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.getUserById(id);
    const data = {
      id: user[0].id,
      firstName: user[0].first_name,
      lastName: user[0].last_name,
      email: user[0].email,
      phoneNumber: user[0].phone_number,
      image: user[0].image
    };
    res
      .status(StatusCodes.OK)
      .send({ status: StatusCodes.OK, message: 'Get test successfully', data: data });
  } catch (error) {
    console.log({ error });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error.message
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id, firstName, lastName, email, phoneNumber } = req.body;
    const user = await User.getUserById(id);

    const userUpdate = {
      ...user[0],
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone_number: phoneNumber
    };

    await User.updateUserById(userUpdate);

    res
      .status(StatusCodes.OK)
      .json({ status: StatusCodes.OK, message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: 'Failed to update user' });
  }
};

exports.setAvatarUser = async (req, res) => {
  try {
    const tokenFromHeader = getToken(req);
    if (tokenFromHeader) {
      const decoded = jwt.verify(tokenFromHeader, process.env.JWT_SECRET);
      if (decoded) {
        const { path: fileStr } = req.file;
        const uploadResponse = await cloudinary.uploader.upload(fileStr);
        const user = await User.getUserById(decoded.id);
        const userUpdate = {
          ...user[0],
          image: uploadResponse.url
        };
        await User.updateUserById(userUpdate);
        res.status(StatusCodes.OK).json({
          status: StatusCodes.OK,
          message: 'Avatar updated successfully',
          data: uploadResponse.url
        });
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

exports.deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await User.deleteUserById(id);
    if (result.affectedRows === 0) {
      res.status(StatusCodes.NOT_FOUND).send({
        status: StatusCodes.NOT_FOUND,
        message: 'User not found'
      });
    } else {
      res.status(StatusCodes.OK).send({
        status: StatusCodes.OK,
        message: 'User deleted successfully'
      });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: 'Failed to update user' });
  }
};
