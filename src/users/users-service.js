const UsersService = {
  getAllUsers(knex) {
    return knex.select("*").from("users");
  },

  getUserById(knex, id) {
    return knex.from("users").select("*").where({ id }).first();
  },

  insertUser(knex, newUser) {
    return knex
      .insert(newUser)
      .into("users")
      .returning("*")
      .then((rows) => rows[0]);
  },
};

module.exports = UsersService;
