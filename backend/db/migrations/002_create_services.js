exports.up = async function up(knex) {
  await knex.schema.createTable('services', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name', 100).notNullable();
    table.text('description').nullable();
    table.text('icon_url').nullable();
    table.decimal('base_price', 10, 2).nullable();
    table.string('price_unit', 20).nullable();
    table.boolean('is_active').notNullable().defaultTo(true);
    table.integer('display_order').notNullable().defaultTo(0);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('services');
};
