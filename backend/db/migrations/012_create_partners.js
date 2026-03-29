exports.up = async function up(knex) {
  await knex.schema.createTable('partners', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').nullable().unique().references('id').inTable('users');
    table.string('name', 120).notNullable();
    table.string('phone', 20).notNullable();
    table.string('email', 255).nullable();
    table.text('address').notNullable();
    table.decimal('lat', 10, 7).nullable();
    table.decimal('lng', 10, 7).nullable();
    table.string('zone', 100).nullable();
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('partners');
};
