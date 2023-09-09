const router = require('express').Router();
const getUsersRouter = require('express').Router();
const getUserByIdRrouter = require('express').Router();
const createUserRouter = require('express').Router();
const updateUserRouter = require('express').Router();
const updateUserAvatarRouter = require('express').Router();
const loginRouter = require('express').Router();
const getMyUserRouter = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const { createUser,getUsers,getUserById, updateUser,updateUserAvatar, login, getMyUser} = require('../controllers/users');


getUsersRouter.get('/users', getUsers);

getUserByIdRrouter.get('/users/me', getMyUser)

getUserByIdRrouter.get('/users/:userId', 
celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24)
  }),
}),
getUserById);


updateUserRouter.patch('/users/me',
celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().required().min(2).max(30).default('Исследователь'),
  }),
}),
  updateUser);

updateUserAvatarRouter.patch('/users/me/avatar',
celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/^(http|https):\/\/(\w|[-\._~:\/\?#\[\]@!\$&'\(\)\*\+,;=])|(#$)/).required().default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png')
  }),
}),
updateUserAvatar);

loginRouter.post('/signin', 
celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}),
login);

createUserRouter.post('/signup', 
celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
    avatar: Joi.string().regex(/^(http|https):\/\/(\w|[-\._~:\/\?#\[\]@!\$&'\(\)\*\+,;=])|(#$)/).default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}),
createUser); 


module.exports = {getUsersRouter, getUserByIdRrouter, createUserRouter, updateUserRouter, updateUserAvatarRouter, loginRouter, getMyUserRouter};
