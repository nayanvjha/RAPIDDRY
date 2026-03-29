exports.seed = async function seed(knex) {
  await knex('coupons').del();

  const now = new Date();
  const sixMonthsFromNow = new Date(now);
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

  const threeMonthsFromNow = new Date(now);
  threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

  await knex('coupons').insert([
    {
      code: 'FIRST50',
      discount_type: 'percent',
      discount_value: 50,
      min_order: 99,
      max_discount: 100,
      expires_at: sixMonthsFromNow,
      usage_limit: 100,
      used_count: 0,
      is_active: true,
    },
    {
      code: 'RAPID20',
      discount_type: 'flat',
      discount_value: 20,
      min_order: 149,
      max_discount: null,
      expires_at: null,
      usage_limit: 500,
      used_count: 0,
      is_active: true,
    },
    {
      code: 'WELCOME',
      discount_type: 'percent',
      discount_value: 30,
      min_order: 199,
      max_discount: 75,
      expires_at: threeMonthsFromNow,
      usage_limit: 200,
      used_count: 0,
      is_active: true,
    },
  ]);
};
