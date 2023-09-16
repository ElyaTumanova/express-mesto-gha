/* eslint-disable function-paren-newline */
/* eslint-disable consistent-return */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable max-len */
/* eslint-disable no-console */
const { default: mongoose } = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const ServerError = require('../errors/server-error');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-error');
const LoginError = require('../errors/login-error');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send(user))
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        return next(new BadRequestError());
        // res.status(400).send({ message: 'Несуществующий Id' })
      }
      return next(new ServerError());
      // return res.status(500).send({ message: 'На сервере произошла ошибка' })
    });
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError());
        // return res.status(404).send({ message: 'Пользователя с таким Id не существует1' })
      }
      return res.send(user);
    })

    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        return next(new BadRequestError());
        // return res.status(400).send({ message: 'Пользователя с таким Id не существует2' })
      }
      return next(new ServerError());
      // return res.status(500).send({ message: 'На сервере произошла ошибка3333' })
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  console.log('signup');

  // User.findOne({email})
  //   .then(user => {
  //   console.log (user);
  //   if(user) {
  //     return res.status(409).send({ message: 'Пользователь с таким email уже зарегистрирован' })
  //   }})

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then(() => res.status(201).send({
      name, about, avatar, email,
    }))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        return next(new BadRequestError());
        // return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' })
      } if (err.code === 11000) {
        console.log('hi');
        return next(new ConflictError());
        // return res.status(409).send({ message: 'Пользователь с таким email уже зарегистрирован' })
      }
      return next(new ServerError());
      // return res.status(500).send({ message: 'На сервере произошла ошибка' })
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError());
        // res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' })
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError());
        // res.status(404).send({ message: 'Пользователя с таким Id не существует' })
      }
      return next(new ServerError());
      // return res.status(500).send({ message: 'На сервере произошла ошибка' })
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError());
        // res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' })
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError());
        // res.status(404).send({ message: 'Пользователя с таким Id не существует' })
      }
      return next(new ServerError());
      // return res.status(500).send({ message: 'На сервере произошла ошибка' })
    });
};

module.exports.login = (req, res, next) => {
  console.log('login');
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
          httpOnly: true,
        });
      res.send({ email: user.email, name: user.name, about: user.about })
        .end();
    })
    .catch((err) =>
      // возвращаем ошибку аутентификации
      next(new LoginError(err.message)),
      // res
      //   .status(401)
      //   .send({ message: err.message });
    );
};

module.exports.getMyUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      console.log(user);
      if (!user) {
        return next(new NotFoundError());
        // res.status(404).send({ message: 'Пользователя с таким Id не существует' })
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError());
        // res.status(400).send({ message: 'Пользователя с таким Id не существует' })
      }
      return next(new ServerError());
      // return res.status(500).send({ message: 'На сервере произошла ошибка' })
    });
};
