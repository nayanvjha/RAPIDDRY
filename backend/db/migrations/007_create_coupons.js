exports.up = async function up(knex) {
  await knex.schema.createTable('coupons', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('code', 50).notNullable().unique();
    table.enu('discount_type', ['flat', 'percent']).notNullable();
    table.decimal('discount_value', 10, 2).notNullable();
    table.decimal('min_order', 10, 2).notNullable().defaultTo(0);
    table.decimal('max_discount', 10, 2).nullable();
    table.timestamp('expires_at').nullable();
    table.integer('usage_limit').nullable();
    table.integer('used_count').notNullable().defaultTo(0);
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('coupons');
};
