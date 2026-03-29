exports.up = async function up(knex) {
  await knex.schema.createTable('payments', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('order_id').notNullable().references('id').inTable('orders');
    table.string('razorpay_order_id', 255).nullable();
    table.string('razorpay_payment_id', 255).nullable();
    table.string('razorpay_signature', 500).nullable();
    table.decimal('amount', 10, 2).notNullable();
    table.string('currency', 10).notNullable().defaultTo('INR');
    table.string('method', 50).nullable();
    table
      .enu('status', ['created', 'authorized', 'captured', 'failed', 'refunded'])
      .notNullable()
      .defaultTo('created');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('payments');
};
