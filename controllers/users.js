const { default: mongoose } = require('mongoose');
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(user => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: 'Несуществующий Id' })
      }
      return res.status(500).send({ message: 'Произошла ошибка' })
    });
}; 

module.exports.getUserById = (req, res) => {

  User.findById(req.params.userId)
    .then(user => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' })
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(404).send({ message: 'Пользователя с таким Id не существует' })
      }
      return res.status(500).send({ message: 'Произошла ошибка' })
    });
}; 

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body; 

  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' })
      }
      return res.status(500).send({ message: 'Произошла ошибка' })
    });
}; 

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name: name, about: about })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' })
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(404).send({ message: 'Пользователя с таким Id не существует' })
      }
      return res.status(500).send({ message: 'Произошла ошибка' })
    });
}

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  console.log(avatar);

  User.findByIdAndUpdate(req.user._id, { avatar: avatar })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' })
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(404).send({ message: 'Пользователя с таким Id не существует' })
      }
      return res.status(500).send({ message: 'Произошла ошибка' })
    });
}