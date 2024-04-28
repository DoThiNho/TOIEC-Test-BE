require('dotenv').config();
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const Book = require('../models/book.model');

exports.getBooks = async (req, res) => {
  try {
    const books = await Book.getAllBook();
    console.log(books);
    res.status(StatusCodes.OK).send({ message: 'Get list book successfully', books });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error.message
    });
  }
};

exports.addBook = async (req, res) => {
  try {
    const newBook = await Book.create(req.body);
    res.status(StatusCodes.CREATED).send({ message: 'Book added successfully', book: newBook });
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
    res.status(StatusCodes.OK).send({ message: 'Book updated successfully', book: updatedBook });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};

// Hàm xóa sách
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(StatusCodes.NOT_FOUND).send({ message: 'Book not found' });
    }
    res.status(StatusCodes.OK).send({ message: 'Book deleted successfully', book: deletedBook });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};

// Hàm tìm kiếm sách theo tiêu đề
exports.searchBooksByTitle = async (req, res) => {
  try {
    const { title } = req.query; // Lấy tiêu đề sách từ query params
    const books = await Book.find({ title: { $regex: title, $options: 'i' } }); // Sử dụng phương thức find của model Book với điều kiện tìm kiếm
    if (books.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ message: 'No books found with the given title' });
    }
    res.status(StatusCodes.OK).send({ message: 'Books found successfully', books });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};
