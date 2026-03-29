exports.up = async function up(knex) {
  await knex.schema.createTable('agents', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').notNullable().unique().references('id').inTable('users');
    table.boolean('is_online').notNullable().defaultTo(false);
    table.decimal('current_lat', 10, 7).nullable();
    table.decimal('current_lng', 10, 7).nullable();
    table.string('zone', 100).nullable();
    table.decimal('rating', 2, 1).notNullable().defaultTo(5.0);
    table.integer('total_deliveries').notNullable().defaultTo(0);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('agents');
};
