const jwt = require('jsonwebtoken');
const WrongLoginData = require('../errors/WrongLoginData');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    throw new WrongLoginData('Требуется авторизация.');
  }
  req.user = payload;
  next();
};

module.exports = auth;
