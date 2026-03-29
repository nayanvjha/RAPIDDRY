exports.up = async function up(knex) {
  const hasColumn = await knex.schema.hasColumn('users', 'fcm_token');

  if (!hasColumn) {
    await knex.schema.alterTable('users', (table) => {
      table.text('fcm_token').nullable();
    });
  }
};

exports.down = async function down(knex) {
  const hasColumn = await knex.schema.hasColumn('users', 'fcm_token');

  if (hasColumn) {
    await knex.schema.alterTable('users', (table) => {
      table.dropColumn('fcm_token');
    });
  }
};
