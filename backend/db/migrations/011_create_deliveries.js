exports.up = async function up(knex) {
  await knex.schema.createTable('deliveries', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('order_id').notNullable().references('id').inTable('orders');
    table.uuid('agent_id').notNullable().references('id').inTable('agents');
    table.enu('type', ['pickup', 'drop']).notNullable();
    table
      .enu('status', ['assigned', 'accepted', 'arrived', 'completed', 'cancelled'])
      .notNullable()
      .defaultTo('assigned');
    table.timestamp('started_at').nullable();
    table.timestamp('completed_at').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('deliveries');
};
