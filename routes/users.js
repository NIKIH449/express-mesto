const usersRouter = require('express').Router();
const {
  getUsers,
  getUsersById,
  updateAvatar,
  getUser,
  updateUser,
} = require('../controllers/users');

usersRouter.patch('/users/me', updateUser);
usersRouter.patch('/users/me/avatar', updateAvatar);
usersRouter.get('/users', getUsers);
usersRouter.get('/users/me', getUser);
usersRouter.get('/users/:_id', getUsersById);

module.exports = usersRouter;
