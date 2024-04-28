require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');

const PORT = process.env.PORT || 8888;

const authRouter = require('./src/routers/auth.router');
const bookRouter = require('./src/routers/book.router');
const testRouter = require('./src/routers/test.router');

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  })
);

app.use('/api/auth', authRouter);
app.use('/api/books', bookRouter);
app.use('/api/tests', testRouter);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
