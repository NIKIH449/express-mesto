const jwt = require('jsonwebtoken');
const { ERROR_403 } = require('../errors/errors');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    res.status(ERROR_403).send({ message: 'Нужно авторизоваться.' });
  }
  req.user = payload;
  next();
};

module.exports = auth;
