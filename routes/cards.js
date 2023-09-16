/* eslint-disable no-useless-escape */
const getCardsRouter = require('express').Router();
const createCardRrouter = require('express').Router();
const deleteCardByIdRouter = require('express').Router();
const likeCardRouter = require('express').Router();
const dislikeCardRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

getCardsRouter.get('/cards', getCards);

createCardRrouter.post(
  '/cards',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().regex(/^(http|https):\/\/(\w|[-\._~:\/\?#\[\]@!\$&'\(\)\*\+,;=])|(#$)/),
    }),
  }),
  createCard,
);

deleteCardByIdRouter.delete(
  '/cards/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteCardById,
);

likeCardRouter.put(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  likeCard,
);

dislikeCardRouter.delete(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  dislikeCard,
);

module.exports = {
  getCardsRouter, createCardRrouter, deleteCardByIdRouter, likeCardRouter, dislikeCardRouter,
};
