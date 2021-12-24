const usersRouter = require('express').Router();
const {
  getUsers,
  getUsersById,
  updateAvatar,
  getUser,
  updateUser,
} = require('../controllers/users');
const { avatarValidation, userInfoValidation } = require('../middlewares/errors');

usersRouter.patch('/users/me', userInfoValidation, updateUser);
usersRouter.patch('/users/me/avatar', avatarValidation, updateAvatar);
usersRouter.get('/users', getUsers);
usersRouter.get('/users/me', getUser);
usersRouter.get('/users/:_id', getUsersById);

module.exports = usersRouter;
