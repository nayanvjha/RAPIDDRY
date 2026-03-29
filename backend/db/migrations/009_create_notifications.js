exports.up = async function up(knex) {
  await knex.schema.createTable('notifications', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('title', 150).notNullable();
    table.text('body').notNullable();
    table
      .enu('type', ['order_update', 'promotion', 'system'])
      .notNullable()
      .defaultTo('order_update');
    table.uuid('order_id').nullable().references('id').inTable('orders');
    table.boolean('is_read').notNullable().defaultTo(false);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('notifications');
};
