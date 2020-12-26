const express = require("express");
const AuthService = require("./auth-service");
const Knex = require("knex");
const AuthService = require("./auth-service");

const authRouter = express.Router();
const bodyParser = express.json();

authRouter
  .route("/login")
  .all((req, res, next) => {
    knexInstance = req.app.get("db");
    next();
  })
  .post(bodyParser, (req, res, next) => {
    const { password, email } = req.body;
    const user = { password, email };
    for (const field of ["email", "password"]) {
      if (!req.body[field]) {
        return res.status(400).json({
          error: `Missing ${field}`,
        });
      }
    }

    AuthService.getUserWithEmail(knex, email).then((dbUser) => {
      if (!dbUser) {
        return res.status(400).json({
          error: "Incorrect email or password",
        });
      }
      res.send("ok");
    });
  });

module.exports = authRouter;
