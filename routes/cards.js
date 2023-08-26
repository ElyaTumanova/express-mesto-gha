const getCardsRouter = require('express').Router();
const createCardRrouter = require('express').Router();
const deleteCardByIdRouter = require('express').Router();
const likeCardRouter = require('express').Router();
const dislikeCardRouter = require('express').Router();
const { getCards, createCard,deleteCardById,likeCard,dislikeCard } = require('../controllers/cards');

getCardsRouter.get('/cards', getCards);

createCardRrouter.post('/cards', createCard); 

deleteCardByIdRouter.delete('/cards/:cardId', deleteCardById); 

likeCardRouter.put('/cards/:cardId/likes', likeCard);

dislikeCardRouter.delete('/cards/:cardId/likes', dislikeCard);

module.exports = {getCardsRouter, createCardRrouter, deleteCardByIdRouter, likeCardRouter, dislikeCardRouter};