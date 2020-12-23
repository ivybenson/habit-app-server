const path = require("path");
const express = require("express");
const logger = require("../logger");
const ProgressService = require("./progress-service");
// const { getProgressValidationError } = require("./progress-validator");

const habitRouter = express.Router();
// const bodyParser = express.json();

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
