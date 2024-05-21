require('dotenv').config();
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const openai = require('../config/chat.config');

exports.chat = async (req, res) => {
  try {
    const { prompt } = req.body;
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'You are a poetic assistant, skilled in explaining complex programming concepts with creative flair.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'gpt-3.5-turbo'
    });
    res.send({
      status: StatusCodes.OK,
      message: getReasonPhrase(StatusCodes.OK),
      response: completion.choices[0].message
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error.message
    });
  }
};
