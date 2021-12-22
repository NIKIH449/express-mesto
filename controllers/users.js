const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { ERROR_500, ERROR_400, ERROR_404 } = require("../errors/errors");
const User = require("../models/user");
const Auth = require("../middlewares/auth");

const getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send({ user }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
        .send({ token, message: 'Авторизация успешна' });
    });
};

const getUsersById = (req, res) => {
  User.findById(req.params._id)
    .then((user) => {
      if (!user) {
        res.status(ERROR_404).send({
          message: "Данные пользователя не найдены.",
        });
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
      if (err.name === "CastError") {
        res.status(ERROR_400).send({
          message: "Переданы некорректные данные.",
        });
      } else {
        res.status(ERROR_500).send({ message: "Произошла ошибка." });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) =>
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
    )
    .then(() => res.status(200).send({ data: { name, about, avatar, email } }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ERROR_400).send({
          message: "Переданы некорректные данные при создании пользователя.",
        });
      } else {
        res.status(ERROR_500).send({ message: "Произошла ошибка." });
      }
    });
};

const updateAvatar = (req, res) => {
  const owner = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(ERROR_404).send({
          message: "Данные пользователя не найдены.",
        });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ERROR_400).send({
          message: "Переданы некорректные данные при обновлении аватара.",
        });
      } else {
        res.status(ERROR_500).send({ message: "Произошла ошибка." });
      }
    });
};

const updateUser = (req, res) => {
  const owner = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    owner,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        res.status(ERROR_404).send({
          message: "Данные пользователя не найдены.",
        });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ERROR_400).send({
          message: "Переданы некорректные данные при обновлении профиля.",
        });
      } else {
        res.status(ERROR_500).send({ message: "Произошла ошибка." });
      }
    });
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
