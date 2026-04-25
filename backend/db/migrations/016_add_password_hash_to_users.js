exports.up = async function up(knex) {
  const hasPasswordHash = await knex.schema.hasColumn('users', 'password_hash');

  if (!hasPasswordHash) {
    await knex.schema.alterTable('users', (table) => {
      table.text('password_hash').nullable();
    });
  }
};

exports.down = async function down(knex) {
  const hasPasswordHash = await knex.schema.hasColumn('users', 'password_hash');

  if (hasPasswordHash) {
    await knex.schema.alterTable('users', (table) => {
      table.dropColumn('password_hash');
    });
  }
};
