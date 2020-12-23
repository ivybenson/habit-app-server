const path = require("path");
const express = require("express");
const xss = require("xss");
const logger = require("../logger");
const UsersService = require("./habit-service");
const { getHabitsValidationError } = require("./habit-validator");

const usersRouter = express.Router();
const bodyParser = express.json();

const SerializeUsers = (users) => ({
  id: users.id,
  email: xss(users.email),
  password: xss(users.password),
  timestamp: users.timestamp,
});

usersRouter
  .route("/")

  .get((req, res, next) => {
    UsersService.getAllUsers(req.app.get("db"))
      .then((habits) => {
        res.json(habits.map(SerializeUsers));
      })
      .catch(next);
  })

  .post(bodyParser, (req, res, next) => {
    const { name, folderid, content } = req.body;
    const newHabit = { name, content, folderid };

    for (const field of ["name", "content", "folderid"]) {
      if (!newHabit[field]) {
        logger.error(`${field} is required`);
        return res.status(400).send({
          error: { message: `'${field}' is required` },
        });
      }
    }

    const error = getHabitsValidationError(newHabit);

    if (error) return res.status(400).send(error);

    UsersService.insertUser(req.app.get("db"), newHabit)
      .then((habit) => {
        logger.info(`habit with id ${habit.id} created.`);
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `${habit.id}`))
          .json(SerializeUsers(habit));
      })
      .catch(next);
  });

usersRouter
  .route("/:user_id")

  .all((req, res, next) => {
    const { user_id } = req.params;
    UsersService.getUserById(req.app.get("db"), user_id)
      .then((habit) => {
        if (!habit) {
          logger.error(`Habit with id ${user_id} not found.`);
          return res.status(404).json({
            error: { message: `Habit Not Found` },
          });
        }

        res.habit = habit;
        next();
      })
      .catch(next);
  })

  .get((req, res) => {
    res.json(SerializeUsers(res.habit));
  })

  .patch(bodyParser, (req, res, next) => {
    const { name, content } = req.body;
    const habitToUpdate = { name, content };

    const numberOfValues = Object.values(habitToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      logger.error(`Invalid update without required fields`);
      return res.status(400).json({
        error: {
          message: `Request body must content either 'name' or 'content'`,
        },
      });
    }

    const error = getHabitsValidationError(habitToUpdate);

    if (error) return res.status(400).send(error);

    UsersService.updateHabit(
      req.app.get("db"),
      req.params.folder_id,
      habitToUpdate
    )
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = usersRouter;
