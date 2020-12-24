const ProgressService = {
  getAllProgress(knex) {
    return knex.select("*").from("progress");
  },

  getProgressByHabit(knex, habit_id) {
    return knex.from("progress").select("*").where({ habit_id }).first();
  },

  insertProgress(knex, newProgress) {
    return knex
      .insert(newProgress)
      .into("progress")
      .returning("*")
      .then((rows) => rows[0]);
  },

  deleteProgress(knex, id) {
    return knex("progress").where({ id }).delete();
  },
};

module.exports = ProgressService;
