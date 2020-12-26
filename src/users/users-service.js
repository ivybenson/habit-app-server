const bcrypt = require("bcryptjs");

const UsersService = {
  hasUserWithEmail(knex, email) {
    return knex("users")
      .where({ email })
      .first()
      .then((user) => !!user);
  },
  insertUser(knex, newUser) {
    return knex
      .insert(newUser)
      .into("users")
      .returning("*")
      .then((user) => user);
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
  // getAllUsers(knex) {
  //   return knex.select("*").from("users");
  // },
  // getUserById(knex, id) {
  //   return knex.from("users").select("*").where({ id }).first();
  // },
  // insertUser(knex, newUser) {
  //   return knex
  //     .insert(newUser)
  //     .into("users")
  //     .returning("*")
  //     .then((rows) => rows[0]);
  // },
};

module.exports = UsersService;
