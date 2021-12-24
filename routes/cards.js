const cardsRouter = require('express').Router();
const {
  createCard,
  getCards,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { cardValidation } = require('../middlewares/errors');

cardsRouter.get('/cards', getCards);
cardsRouter.post('/cards', cardValidation, createCard);
cardsRouter.delete('/cards/:_id', deleteCardById);
cardsRouter.put('/cards/:_id/likes', likeCard);
cardsRouter.delete('/cards/:_id/likes', dislikeCard);

module.exports = cardsRouter;
