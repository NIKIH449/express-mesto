const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;
const { loginValidation, createUserValidation } = require('./middlewares/errors');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.post('/signin', loginValidation, login);
app.post('/signup', createUserValidation, createUser);
app.use('/', auth, userRouter);
app.use('/', auth, cardRouter);
app.use(() => {
  throw new NotFoundError('Произошла ошибка.');
});
mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT);
