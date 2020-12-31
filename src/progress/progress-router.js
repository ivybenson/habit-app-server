const path = require("path");
const express = require("express");
const logger = require("../logger");
const ProgressService = require("./progress-service");

const { requireAuth } = require("../middleware/jwt-auth");

const progressRouter = express.Router();
const bodyParser = express.json();

progressRouter.route("/").post(bodyParser, (req, res) => {
  const knexInstance = req.app.get("db");
  const { habit_id, date } = req.body;
  ProgressService.getProgressByHabitAndDate(knexInstance, habit_id, date).then(
    (event) => {
      if (!event) {
        ProgressService.createProgress(knexInstance, {
          habit_id,
          datecreated: date,
        }).then((row) => {
          res.status(201).json(row);
        });
      } else {
        ProgressService.deleteProgress(knexInstance, event.id).then(() => {
          res.status(200).json(event);
        });
      }
    }
  );
});

progressRouter.route("/byhabits").post(bodyParser, (req, res) => {
  const knexInstance = req.app.get("db");
  const { habit_ids = [] } = req.body;
  console.log(req.body);
  ProgressService.getProgressByHabits(knexInstance, habit_ids).then(
    (events) => {
      res.json(events);
    }
  );
});

module.exports = progressRouter;
