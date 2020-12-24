const path = require("path");
const express = require("express");
const xss = require("xss");
const logger = require("../logger");
const UsersService = require("./users-service");
const { getUsersValidationError } = require("./users-validator");

const usersRouter = express.Router();
const bodyParser = express.json();

const SerializeUsers = (users) => ({
  email: xss(users.email),
  password: xss(users.password),
  timestamp: users.timestamp,
});

//auth videos support guide

usersRouter
  .route("/")

  .get((req, res, next) => {
    UsersService.getAllUsers(req.app.get("db"))
      .then((users) => {
        res.json(users.map(SerializeUsers));
      })
      .catch(next);
  })

  .post(bodyParser, (req, res, next) => {
    const { email, password } = req.body;
    const newuser = { email, password };

    for (const field of ["email", "password"]) {
      if (!newuser[field]) {
        logger.error(`${field} is required`);
        return res.status(400).send({
          error: { message: `'${field}' is required` },
        });
      }
    }

    const error = getUsersValidationError(newuser);

    if (error) return res.status(400).send(error);

    UsersService.insertUser(req.app.get("db"), newuser)
      .then((user) => {
        logger.info(`user with id ${user.id} created.`);
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `${user.id}`))
          .json(SerializeUsers(user));
      })
      .catch(next);
  });

module.exports = usersRouter;
