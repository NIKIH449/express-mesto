const { ERROR_500, ERROR_400, ERROR_404 } = require("../errors/errors");
const User = require("../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

const getUsersById = (req, res) => {
  User.findById(req.params._id)
    .then((user) => res.send({ data: user}))
    .catch(() =>
      res
        .status(ERROR_404)
        .send({ message: "Пользователь с указанным id не найдена." })
    );
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
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
  User.findByIdAndUpdate({ avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ERROR_404).send({
          message: "Передан несуществующий id пользователя. ",
        });
      } else {
        res.status(ERROR_500).send({ message: "Произошла ошибка." });
      }
    });
};

const updateUser = (req, res) => {
  const owner = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(owner, { name, about })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ERROR_404).send({
          message: "Передан несуществующий id пользователя. ",
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
};
