const usersRouter = require("express").Router();
const {
  createUser,
  getUsers,
  getUsersById,
  updateAvatar,
  updateUser,
} = require("../controllers/users");

usersRouter.post("/users", createUser);
usersRouter.patch("/users/me", updateUser);
usersRouter.patch("/users/me/avatar", updateAvatar);
usersRouter.get("/users", getUsers);
usersRouter.get("/users/:_id", getUsersById);

module.exports = usersRouter;
