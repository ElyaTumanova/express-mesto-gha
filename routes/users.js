const router = require('express').Router();
const getUsersRouter = require('express').Router();
const getUserByIdRrouter = require('express').Router();
const createUserRouter = require('express').Router();
const updateUserRouter = require('express').Router();
const updateUserAvatarRouter = require('express').Router();

const { createUser,getUsers,getUserById, updateUser,updateUserAvatar} = require('../controllers/users');


getUsersRouter.get('/users', getUsers);

getUserByIdRrouter.get('/users/:userId', getUserById);

createUserRouter.post('/users', createUser); 

updateUserRouter.patch('/users/me',updateUser);

updateUserAvatarRouter.patch('/users/me/avatar',updateUserAvatar);

module.exports = {getUsersRouter, getUserByIdRrouter, createUserRouter, updateUserRouter, updateUserAvatarRouter};
