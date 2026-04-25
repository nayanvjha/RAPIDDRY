const bcrypt = require('bcryptjs');

exports.seed = async function seed(knex) {
  const passwordHash = await bcrypt.hash('Rapidry@2026', 10);

  await knex('users')
    .insert({
      firebase_uid: 'admin-dashboard-user',
      name: 'Nayan Kumar',
      phone: '+910000000000',
      email: 'admin@rapidry.in',
      role: 'admin',
      password_hash: passwordHash,
      is_active: true,
      updated_at: knex.fn.now(),
    })
    .onConflict('firebase_uid')
    .merge({
      name: 'Nayan Kumar',
      phone: '+910000000000',
      email: 'admin@rapidry.in',
      role: 'admin',
      password_hash: passwordHash,
      is_active: true,
      updated_at: knex.fn.now(),
    });
};
