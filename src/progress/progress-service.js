const ProgressService = {
  getAllprogress(knex) {
    return knex.select("*").from("progress");
  },

  getprogressById(knex, id) {
    return knex.from("progress").select("*").where({ id }).first();
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
  updateProgress(knex, id, newprogressFields) {
    return knex("progress").where({ id }).update(newprogressFields);
  },
};

module.exports = ProgressService;
