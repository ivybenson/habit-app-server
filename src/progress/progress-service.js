const ProgressService = {
  getProgressByHabit(knex, habit_id) {
    return knex.from("progress").select("*").where({ habit_id }).first();
  },
  getProgressByHabits(knex, habit_ids) {
    return knex.from("progress").select("*").whereIn("habit_id", habit_ids);
  },
  getProgressByHabitAndDate(knex, habit_id, datecreated) {
    console.log({ habit_id, datecreated });
    return knex
      .from("progress")
      .select("*")
      .where({ habit_id })
      .andWhere({ datecreated })
      .first();
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
