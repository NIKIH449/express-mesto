const express = require("express");
const bodyParser = require("body-parser");
const { PORT = 3000 } = process.env;
const mongoose = require("mongoose");
const app = express();
const router = require('./routes/users')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.listen(PORT, () => {
  console.log(`App l1istasdeninga on port ${PORT}`);
});
