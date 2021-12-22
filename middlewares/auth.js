const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
console.log(req.сookies)
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    throw new Error('Нужно авторизироваться');
  }
  req.user = payload;
  next();
};

module.exports = auth;
