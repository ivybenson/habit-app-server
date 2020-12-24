const HabitsService = {
  getAllHabits(knex) {
    return knex.select("*").from("habits");
  },

  getHabitById(knex, id) {
    return knex.from("habits").select("*").where({ id }).first();
  },

  getHabitsByUser(knex, user_id) {
    return knex.from("habits").select("*").where({ user_id }).first();
  },

  insertHabit(knex, newHabit) {
    return knex
      .insert(newHabit)
      .into("habits")
      .returning("*")
      .then((rows) => rows[0]);
  },

  deleteHabit(knex, id) {
    return knex("habits").where({ id }).delete();
  },
  updateHabit(knex, id, newHabitFields) {
    return knex("habits").where({ id }).update(newHabitFields);
  },
};

module.exports = HabitsService;
