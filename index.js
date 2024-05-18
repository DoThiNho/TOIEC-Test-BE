require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const app = express();
require('./src/config/passport.config')(passport);

const PORT = process.env.PORT || 8888;

const authRouter = require('./src/routers/auth.router');
const userRouter = require('./src/routers/user.router');
const bookRouter = require('./src/routers/book.router');
const testRouter = require('./src/routers/test.router');
const achievementRouter = require('./src/routers/achievement.router');
const questionRouter = require('./src/routers/question.router');
const fileRouter = require('./src/routers/file.router');
const vocabularyRouter = require('./src/routers/vocabulary.router');

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/books', bookRouter);
app.use('/api/tests', testRouter);
app.use('/api/results', achievementRouter);
app.use('/api/questions', questionRouter);
app.use('/api/files', fileRouter);
app.use('/api/vocabularies', vocabularyRouter);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
