const { default: mongoose } = require('mongoose');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const NotFoundError = require('../errors/not-found-err');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(user => res.send(user))
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        const err = new Error('Несуществующий Id'); 
        err.statusCode = 400;
        next(err);
    //res.status(400).send({ message: 'Несуществующий Id' })
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' })
    });
}; 

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then(user => {
      if(!user) {
        //throw new NotFoundError('Пользователя с таким Id не существует1');
        return res.status(404).send({ message: 'Пользователя с таким Id не существует1' })
      }        
      return res.send(user)})
      
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        //next(new NotFoundError('Пользователя с таким Id не существует2'))
        //throw new NotFoundError('Пользователя с таким Id не существует2');
        return res.status(400).send({ message: 'Пользователя с таким Id не существует2' })
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка3333' })
    });
}; 

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  console.log('signup') 

  //   if (err.code === 11000) {
  //   // Обработка ошибки
  //   return res.status(409).send({ message: 'Пользователь с таким email уже зарегистрирован' })
  // } 

  User.findOne({email})
    .then(user => {
    console.log (user);
    if(user) {
      console.log('hi')
      return res.status(409).send({ message: 'Пользователь с таким email уже зарегистрирован' })
    }})

  bcrypt.hash(password, 10)
    .then(hash => User.create({ name, about, avatar, email, password:hash })
    )
    .then(user => res.send({ name, about, avatar, email }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' })
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' })
    });
}; 

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name: name, about: about }, { runValidators: true, new: true})
    .then(user => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' })
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(404).send({ message: 'Пользователя с таким Id не существует' })
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' })
    });
}

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar: avatar },{ runValidators: true, new: true})
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' })
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(404).send({ message: 'Пользователя с таким Id не существует' })
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' })
    });
}

module.exports.login = (req, res) => {
  console.log('login')
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, 'some-secret-key');

      // вернём токен
      res
      .cookie('jwt', token, {
            // token - наш JWT токен, который мы отправляем
        maxAge: 3600000,
        httpOnly: true
      })
      .end();
    })    
    .catch((err) => {
      // возвращаем ошибку аутентификации
      res
        .status(200)
        .send({ message: err.message });
    });
}

module.exports.getMyUser = (req, res) => {
  User.findById(req.user._id)
    .then(user => {
      console.log (user);
      if(!user) {
        res.status(404).send({ message: 'Пользователя с таким Id не существует' })
      }        
      res.send(user)})
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: 'Пользователя с таким Id не существует' })
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' })
    });
};