const ProgressService = {
  getProgressByHabit(knex, habit_id) {
    return knex.from("progress").select("*").where({ habit_id }).first();
  },

  createProgress(knex, newProgress) {
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
