const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const { loginValidation, createUserValidation } = require('./middlewares/errors');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);
app.post('/signin', loginValidation, login);
app.post('/signup', createUserValidation, createUser);
app.use('/', auth, userRouter);
app.use('/', auth, cardRouter);
app.use('*', () => {
  throw new NotFoundError('Такой страницы не существует.');
});
app.use(errorLogger)
app.use(errors());
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const { message } = err;
  res.status(status).json({ message: message || 'Произошла ошибка на сервере' });
  return next();
});
mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT);
