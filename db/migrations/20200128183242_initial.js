
exports.up = (knex) => {
  return knex.schema
    .createTable('metros', (table) => {
      table.increments('id').primary();
      table.string('metro');
      table.integer('population').unsigned();
      table.string('teams');
      table.timestamps(true, true);
    })
    .createTable('titles', (table) => {
      table.increments('id').primary();
      table.integer('year').unsigned();
      table.string('level');
      table.string('sport');
      table.string('winner');
      table.string('title_metro');
      table.integer('metro_id').unsigned()
      table.foreign('metro_id')
        .references('metros.id');
      table.timestamps(true, true);
    })
};

exports.down = (knex) => {
  return knex.schema
  .dropTable('titles')
  .dropTable('metros')
};
