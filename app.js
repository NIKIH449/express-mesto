const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '61ac92a617e52314174db99f',
  };
  next();
});
app.use(userRouter);
app.use(cardRouter);
mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT);
