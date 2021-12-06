const cardsRouter = require("express").Router();
const {
  createCard,
  getCards,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

cardsRouter.get("/cards", getCards);
cardsRouter.post("/cards", createCard);
cardsRouter.delete("/cards/:_id", deleteCardById);
cardsRouter.put("/cards/:_id/likes", likeCard);
cardsRouter.delete("/cards/:_id/likes", dislikeCard);

module.exports = cardsRouter;
