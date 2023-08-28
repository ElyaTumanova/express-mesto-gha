const Card = require('../models/card');
const { default: mongoose } = require('mongoose');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: 'Несуществующий Id' })
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' })
    });
}; 

module.exports.createCard = (req, res) => {
  const { name, link } = req.body; 

  Card.create({ name, link, owner: req.user._id })
    .then(card => res.send({ data: card }))
    .catch((err) => {
      console.log (err)
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' })
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' })
    });
}; 

module.exports.deleteCardById = (req, res) => {

  Card.findByIdAndRemove(req.params.cardId,{ new: true })
    .then(card => {
      if(!card) {
        res.status(404).send({ message: 'Карточки с таким Id не существует' })
      } 
      res.send({ data: card })
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: 'Карточки с таким Id не существует' })
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' })
    });
}; 

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
  .then (card => {
    if(!card) {
      res.status(404).send({ message: 'Карточки с таким Id не существует' })
    } 
    res.send({ data: card })
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.CastError) {
      res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятия лайка' })
    }
    return res.status(500).send({ message: 'На сервере произошла ошибка' })
  });  
}

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } },{ new: true })
  .then (card => {
    if(!card) {
      res.status(404).send({ message: 'Карточки с таким Id не существует' })
    } 
    res.send({ data: card })
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.CastError) {
      res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятия лайка' })
    }
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      res.status(404).send({ message: 'Карточки с таким Id не существует' })
    }
    return res.status(500).send({ message: 'На сервере произошла ошибка' })
  });    
}