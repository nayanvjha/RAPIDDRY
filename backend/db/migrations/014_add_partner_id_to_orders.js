exports.up = async function up(knex) {
  const hasColumn = await knex.schema.hasColumn('orders', 'partner_id');

  if (!hasColumn) {
    await knex.schema.alterTable('orders', (table) => {
      table.uuid('partner_id').nullable().references('id').inTable('partners').onDelete('SET NULL');
    });
  }
};

exports.down = async function down(knex) {
  const hasColumn = await knex.schema.hasColumn('orders', 'partner_id');

  if (hasColumn) {
    await knex.schema.alterTable('orders', (table) => {
      table.dropColumn('partner_id');
    });
  }
};
