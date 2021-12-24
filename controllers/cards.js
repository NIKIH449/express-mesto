const { ERROR_500 } = require('../errors/errors');
const Card = require('../models/card');
const Forbidden = require('../errors/Forbidden');
const NotFoundError = require('../errors/NotFoundError');
const WrongData = require('../errors/WrongData');

const getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => res.send({ message: 'Произошла ошибка' }));
};

const deleteCardById = (req, res, next) => {
  Card.findById(req.params._id)
    .then((cards) => {
      if (req.user._id === cards.owner.toString()) {
        Card.findByIdAndRemove(req.params._id).then((card) => {
          res.send({ data: card });
        });
      } else {
        throw new Forbidden('Нельзя удалять чужую карочку');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new WrongData('Передан несуществующий id карточки');
      } else {
        res.status(ERROR_500).send({ message: 'Произошла ошибка' });
      }
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new WrongData('Переданы неверные данные.');
      } else {
        res.status(ERROR_500).send({ message: 'Произошла ошибка.' });
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  const owner = req.user._id;
  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: owner } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Картока не найдена');
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new WrongData('Передан несуществующий id карточки.');
      } else {
        res.status(ERROR_500).send({ message: 'Произошла ошибка.' });
      }
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  const owner = req.user._id;
  Card.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: owner } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new WrongData('Переданы неверные данные.');
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new WrongData('Переданы неверные данные.');
      } else {
        res.status(ERROR_500).send({ message: 'Произошла ошибка.' });
      }
    })
    .catch(next);
};

module.exports = {
  createCard,
  deleteCardById,
  getCards,
  likeCard,
  dislikeCard,
};
