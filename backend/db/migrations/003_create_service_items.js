exports.up = async function up(knex) {
  await knex.schema.createTable('service_items', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .uuid('service_id')
      .notNullable()
      .references('id')
      .inTable('services')
      .onDelete('CASCADE');
    table.string('name', 100).notNullable();
    table.decimal('price', 10, 2).notNullable();
    table.string('unit', 20).notNullable().defaultTo('per_item');
    table.text('icon_url').nullable();
    table.boolean('is_active').notNullable().defaultTo(true);
    table.integer('display_order').notNullable().defaultTo(0);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('service_items');
};
