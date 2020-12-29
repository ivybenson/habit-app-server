const path = require("path");
const express = require("express");
const logger = require("../logger");
const ProgressService = require("./progress-service");

const { requireAuth } = require("../middleware/jwt-auth");

const habitRouter = express.Router();
const bodyParser = express.json();

const SerializeProgress = (progress) => ({
  id: progress.id,
  datecreated: progress.date,
  habit_id: progress.habit_id,
});

habitRouter.route("/").post((req, res) => {
  const { habit_id, date } = req.body;
  ProgressService.getByHabitDate(knexInstance, habit_id, date).then((res) => {
    if (!res) {
      ProgressService.createProgress(knexInstance, habit_id, date).then(
        (row) => {
          res.status(201).json(row);
        }
      );
    } else {
      ProgressService.deleteProgress(knexInstance, habit_id, date).then(
        (row) => {
          res.status(204);
        }
      );
    }
  });
});

module.exports = habitRouter;
