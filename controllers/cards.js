const Card = require("../models/card");

const getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

const deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params._id)
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

const likeCard = (req, res) => {
  const owner = req.user._id;
  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: owner } },
    { new: true }
  )
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

const dislikeCard = (req, res) => {
  const owner = req.user._id;
  Card.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: owner } },
    { new: true }
  )
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports = {
  createCard,
  deleteCardById,
  getCards,
  likeCard,
  dislikeCard,
};
