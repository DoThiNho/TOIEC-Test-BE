require('dotenv').config();
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const Question = require('../models/questions.model');
const File = require('../models/files.model');
const Part = require('../models/parts.model');
const Test = require('../models/tests.model');
const Book = require('../models/books.model');
const { v4: uuid } = require('uuid');
const path = require('path');
const XLSX = require('xlsx');
const GroupQuestions = require('../models/groupQuestions.model');
const { group } = require('console');

exports.addQuestions = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).send({ error: 'No file uploaded' });
    }
    const { test_id } = req.body;
    const parts = [];
    for (let i = 1; i <= 7; i++) {
      let partType = null;
      if (i <= 4) {
        partType = 'listening';
      } else {
        partType = 'reading';
      }

      const part = {
        test_id,
        part_num: i.toString(),
        type: partType,
        id: uuid()
      };
      await Part.create(part);
      parts.push(part);
    }
    const filePath = path.join(__dirname, '..', req.file.path);
    const workbook = XLSX.readFile(`${req.file.path}`);
    const sheetName = workbook.SheetNames[0];
    const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const questions = worksheet.map((row) => ({
      test_id,
      part_id: parts.find((part) => part.part_num === row.part?.toString())?.id,
      question_title: row.question,
      answer_a: row.option1,
      answer_b: row.option2,
      answer_c: row.option3,
      answer_d: row.option4,
      correct_answer: row.correctanswer,
      image: row.image,
      audio: row.audio,
      order: row.number,
      group_id: row.group_id,
      id: uuid()
    }));

    const files = [];
    for (let question of questions) {
      const partNum = parts.find((part) => part.id === question.part_id)?.part_num;
      if (['3', '4', '6', '7'].includes(partNum)) {
        const isExist = files.some((file) => {
          return file.audio === question.audio && file.image === question.image;
        });
        if (!isExist) {
          files.push({
            audio: question.audio,
            image: question.image
          });
        }
      } else {
        await Question.create(question);
      }
    }

    for (let file of files) {
      const listQuestionByFile = questions.filter(
        (question) => question.audio === file.audio && question.image === file.image
      );
      if (listQuestionByFile.length > 1) {
        const idGroupQuestion = uuid();
        const newGroupQuestion = await GroupQuestions.create({
          part_id: listQuestionByFile[0].part_id,
          test_id: 1,
          group_image: listQuestionByFile[0].image,
          group_audio: listQuestionByFile[0].audio
        });
        for (let q of listQuestionByFile) {
          if (q.part_id) {
            await Question.create({
              ...q,
              group_id: newGroupQuestion.insertId
            });
          }
        }
      } else {
        await Question.create({ ...listQuestionByFile[0] });
      }
    }

    res.status(StatusCodes.CREATED).send({
      status: 201,
      message: 'Questions created successfully'
    });
  } catch (error) {
    console.log({ error });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const {
      test_id,
      part_id,
      question_title,
      answer_a,
      answer_b,
      answer_c,
      answer_d,
      correct_answer,
      image,
      audio,
      order,
      group_id
    } = req.body;

    const updateFields = {
      test_id,
      part_id,
      question_title,
      answer_a,
      answer_b,
      answer_c,
      answer_d,
      correct_answer,
      image,
      audio,
      order,
      group_id
    };

    // Handle file uploads if any
    if (req.files) {
      if (req.files.fileImage && req.files.fileImage.length > 0) {
        const fileImage = req.files.fileImage[0].originalname;
        updateFields.image = fileImage;
      }
      if (req.files.fileAudio && req.files.fileAudio.length > 0) {
        const fileAudio = req.files.fileAudio[0].originalname;
        updateFields.audio = fileAudio;
      }
    }

    const result = await Question.update(questionId, updateFields);

    if (result.affectedRows === 0) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: StatusCodes.NOT_FOUND,
        message: 'Question not found'
      });
    }

    res.status(StatusCodes.OK).send({
      status: StatusCodes.OK,
      message: 'Question updated successfully'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error.message || 'Internal Server Error'
    });
  }
};

exports.getQuestionsByPartId = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, part } = req.query;
    let questions = [];
    let parts = part;
    if (type === 'fulltest') {
      parts = ['1', '2', '3', '4', '5', '6', '7'];
    }
    if (Array.isArray(parts)) {
      for (const partNum of parts) {
        const partDetail = await Part.getPartByPartNumAndTestId(partNum, id);
        const partId = partDetail[0]?.id;
        const questionsByPartNumTestId = await Question.getQuestionsByPartId(partId);
        questionsByPartNumTestId.forEach((element) => {
          element.part_num = partDetail[0].part_num;
        });
        questions.push(...questionsByPartNumTestId);
      }
    } else {
      const partDetail = await Part.getPartByPartNumAndTestId(parts, id);
      const partId = partDetail[0]?.id;
      const questionsByPartId = await Question.getQuestionsByPartId(partId);
      questionsByPartId.forEach((element) => {
        element.part_num = partDetail[0]?.part_num;
      });
      questions.push(...questionsByPartId);
    }
    const test = await Test.getTestById(id);
    let book = {};
    if (test[0]) {
      book = await Book.getBookById(test[0].book_id);
    }
    res.status(StatusCodes.OK).send({
      status: StatusCodes.OK,
      message: 'Get list question successfully',
      data: {
        test_title: test[0]?.title,
        book_title: book[0]?.title,
        audio_link: test[0]?.audio_link,
        questions
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};
