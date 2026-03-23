exports.up = async function up(knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('firebase_uid').notNullable().unique();
    table.string('name', 100).nullable();
    table.string('phone', 15).notNullable();
    table.string('email', 255).nullable();
    table.enu('role', ['customer', 'agent', 'admin', 'partner']).notNullable().defaultTo('customer');
    table.text('avatar_url').nullable();
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('users');
};
