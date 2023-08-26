const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: 'Несуществующий Id' })
      }
      return res.status(500).send({ message: 'Произошла ошибка' })
    });
}; 

module.exports.createCard = (req, res) => {
  console.log(req.user._id);
  const { name, link } = req.body; 

  Card.create({ name, link })
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' })
      }
      return res.status(500).send({ message: 'Произошла ошибка' })
    });
}; 

module.exports.deleteCardById = (req, res) => {

  Card.findByIdAndRemove(req.params.cardId)
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(404).send({ message: 'Карточки с таким Id не существует' })
      }
      return res.status(500).send({ message: 'Произошла ошибка' })
    });
}; 

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId)
  .then ({ $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true })
  .catch((err) => {
    if (err instanceof mongoose.Error.CastError) {
      res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятия лайка' })
    }
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      res.status(404).send({ message: 'Карточки с таким Id не существует' })
    }
    return res.status(500).send({ message: 'Произошла ошибка' })
  });  
}

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId)
  .then ({ $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true })
  .catch((err) => {
    if (err instanceof mongoose.Error.CastError) {
      res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятия лайка' })
    }
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      res.status(404).send({ message: 'Карточки с таким Id не существует' })
    }
    return res.status(500).send({ message: 'Произошла ошибка' })
  });    
}