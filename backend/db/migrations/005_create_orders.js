exports.up = async function up(knex) {
  await knex.schema.createTable('orders', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('order_number', 20).notNullable().unique();
    table.uuid('customer_id').notNullable().references('id').inTable('users');
    table.uuid('address_id').notNullable().references('id').inTable('addresses');
    table
      .enu('status', [
        'placed',
        'agent_assigned',
        'picked_up',
        'processing',
        'ready',
        'out_for_delivery',
        'delivered',
        'cancelled',
      ])
      .notNullable()
      .defaultTo('placed');
    table.decimal('total', 10, 2).notNullable();
    table.decimal('delivery_fee', 10, 2).notNullable().defaultTo(0);
    table.decimal('discount', 10, 2).notNullable().defaultTo(0);
    table
      .enu('payment_status', ['pending', 'paid', 'failed', 'refunded'])
      .notNullable()
      .defaultTo('pending');
    table.enu('payment_method', ['upi', 'card', 'cod', 'wallet']).nullable();
    table.date('pickup_date').notNullable();
    table.string('pickup_slot', 50).notNullable();
    table.text('special_instructions').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('orders');
};
