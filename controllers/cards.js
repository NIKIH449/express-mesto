const { ERROR_500, ERROR_400, ERROR_404 } = require('../errors/errors');
const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => res.send({ message: 'Произошла ошибка' }));
};

const deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params._id)
    .then((card) => {
      if (!card) {
        res.status(ERROR_404).send({
          message: 'Данные карточки не найдены.',
        });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_400).send({
          message: 'Переданы некорректные данные.',
        });
      } else {
        res.status(ERROR_500).send({ message: 'Произошла ошибка.' });
      }
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_400).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      } else {
        res.status(ERROR_500).send({ message: 'Произошла ошибка.' });
      }
    });
};

const likeCard = (req, res) => {
  const owner = req.user._id;
  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: owner } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_404).send({
          message: 'Данные карточки не найдены.',
        });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_400).send({
          message: 'Передан несуществующий id карточки. ',
        });
      } else {
        res.status(ERROR_500).send({ message: 'Произошла ошибка.' });
      }
    });
};

const dislikeCard = (req, res) => {
  const owner = req.user._id;
  Card.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: owner } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_404).send({
          message: 'Данные карточки не найдены.',
        });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_400).send({
          message: 'Передан несуществующий id карточки. ',
        });
      } else {
        res.status(ERROR_500).send({ message: 'Произошла ошибка.' });
      }
    });
};

module.exports = {
  createCard,
  deleteCardById,
  getCards,
  likeCard,
  dislikeCard,
};
