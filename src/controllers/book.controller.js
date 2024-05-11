require('dotenv').config();
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const Book = require('../models/books.model');

exports.getBooks = async (req, res) => {
  try {
    const { search, page, limit } = req.query;
    const books = await Book.getBooks(search, page, limit);
    res
      .status(StatusCodes.OK)
      .send({ status: StatusCodes.OK, message: 'Get list book successfully', books });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error.message
    });
  }
};

exports.addBook = async (req, res) => {
  try {
    const newBook = await Book.create(req.body);
    res
      .status(StatusCodes.CREATED)
      .send({ status: StatusCodes.OK, message: 'Book added successfully', book: newBook });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedBook) {
      return res.status(StatusCodes.NOT_FOUND).send({ message: 'Book not found' });
    }
    res
      .status(StatusCodes.OK)
      .send({ status: StatusCodes.OK, message: 'Book updated successfully', book: updatedBook });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(StatusCodes.NOT_FOUND).send({ message: 'Book not found' });
    }
    res
      .status(StatusCodes.OK)
      .send({ status: StatusCodes.OK, message: 'Book deleted successfully', book: deletedBook });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};

exports.searchBooksByTitle = async (req, res) => {
  try {
    const { title } = req.query;
    const books = await Book.find({ title: { $regex: title, $options: 'i' } });
    if (books.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ message: 'No books found with the given title' });
    }
    res
      .status(StatusCodes.OK)
      .send({ status: StatusCodes.OK, message: 'Books found successfully', books });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};
