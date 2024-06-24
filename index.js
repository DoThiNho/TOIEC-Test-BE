require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const http = require('http');
const { initializeSocketIo } = require('./src/config/socketIo.config');

const PORT = process.env.PORT || 8888;
const server = http.createServer(app);
initializeSocketIo(server);

const authRouter = require('./src/routers/auth.router');
const userRouter = require('./src/routers/user.router');
const bookRouter = require('./src/routers/book.router');
const testRouter = require('./src/routers/test.router');
const achievementRouter = require('./src/routers/achievement.router');
const questionRouter = require('./src/routers/question.router');
const fileRouter = require('./src/routers/file.router');
const vocabularyRouter = require('./src/routers/vocabulary.router');
const partRouter = require('./src/routers/part.router');
const groupQuestionsRouter = require('./src/routers/groupQuestion.router');

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/books', bookRouter);
app.use('/api/tests', testRouter);
app.use('/api/results', achievementRouter);
app.use('/api/questions', questionRouter);
app.use('/api/files', fileRouter);
app.use('/api/vocabularies', vocabularyRouter);
app.use('/api/parts', partRouter);
app.use('/api/group-question', groupQuestionsRouter);

server.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
