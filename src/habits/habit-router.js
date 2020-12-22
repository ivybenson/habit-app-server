const path = require("path");
const express = require("express");
const xss = require("xss");
const logger = require("../logger");
const HabitsService = require("./habit-service");
const { getHabitsValidationError } = require("./habit-validator");

const habitRouter = express.Router();
const bodyParser = express.json();

const SerializeHabits = (habits) => ({
  id: habits.id,
  title: xss(habits.title),
  timestamp: habits.timestamp,
  userid: xss(habits.userid),
  note: xss(habits.content),
});

habitRouter
  .route("/")

  .get((req, res, next) => {
    HabitsService.getAllHabits(req.app.get("db"))
      .then((habits) => {
        res.json(habits.map(SerializeHabits));
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

    HabitsService.insertNote(req.app.get("db"), newHabit)
      .then((habit) => {
        logger.info(`habit with id ${habit.id} created.`);
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `${habit.id}`))
          .json(SerializeHabits(habit));
      })
      .catch(next);
  });

habitRouter
  .route("/:habit_id")

  .all((req, res, next) => {
    const { habit_id } = req.params;
    HabitsService.getNoteById(req.app.get("db"), habit_id)
      .then((habit) => {
        if (!habit) {
          logger.error(`Habit with id ${habit_id} not found.`);
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
    res.json(SerializeHabits(res.habit));
  })

  .delete((req, res, next) => {
    const { habit_id } = req.params;
    HabitsService.deleteNote(req.app.get("db"), habit_id)
      .then((numRowsAffected) => {
        logger.info(`habit with id ${habit_id} deleted.`);
        res.status(204).end();
      })
      .catch(next);
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

    HabitsService.updateHabit(
      req.app.get("db"),
      req.params.folder_id,
      habitToUpdate
    )
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = habitRouter;
