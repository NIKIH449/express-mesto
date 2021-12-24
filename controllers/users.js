const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {
  ERROR_500, ERROR_404, ERROR_509,
} = require('../errors/errors');
const NotFoundError = require('../errors/NotFoundError');
const WrongData = require('../errors/WrongData');
const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const getUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => res.send({ user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
        .send({ message: 'Авторизация успешна' });
    })
    .catch(next);
};

const getUsersById = (req, res, next) => {
  User.findById(req.params._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Данные пользователя не найдены.');
      } else {
        res.send({
          data: {
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            _id: user._id,
          },
        });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new WrongData('Переданы некорректные данные.');
      } else {
        res.status(ERROR_500).send({ message: 'Произошла ошибка.' });
      }
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        res.status(ERROR_509).send({
          message: 'Такой пользователь уже существует.',
        });
      }
    })
    .then(() => res.status(200).send({
      data: {
        name, about, avatar, email,
      },
    }))
    .catch(next)
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new WrongData('Переданы некорректные данные.');
      } else {
        res.status(ERROR_500).send({ message: 'Произошла ошибка.' });
      }
    });
};

const updateAvatar = (req, res, next) => {
  const owner = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Данные пользователя не найдены.');
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new WrongData('Переданы некорректные данные.');
      } else {
        res.status(ERROR_500).send({ message: 'Произошла ошибка.' });
      }
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const owner = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    owner,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res.status(ERROR_404).send({
          message: 'Данные пользователя не найдены.',
        });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new NotFoundError('Данные пользователя не найдены.');
      } else {
        res.status(ERROR_500).send({ message: 'Произошла ошибка.' });
      }
    })
    .catch(next);
};

module.exports = {
  createUser,
  getUsers,
  getUsersById,
  updateUser,
  updateAvatar,
  login,
  getUser,
};
