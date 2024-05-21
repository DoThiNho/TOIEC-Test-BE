require('dotenv').config();
const { Configuration, OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.CHAT_API_KEY
});

module.exports = openai;
