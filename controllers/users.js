const User = require("../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

const getUsersById = (req, res) => {
  User.findById(req.params._id)
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

const updateAvatar = (req, res) => {
  const owner = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(owner, { avatar })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

const updateUser = (req, res) => {
  const owner = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(owner, { name, about })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports = {
  createUser,
  getUsers,
  getUsersById,
  updateUser,
  updateAvatar,
};
