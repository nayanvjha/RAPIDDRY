exports.seed = async function seed(knex) {
  const testFirebaseUids = [
    'test_admin_uid',
    'test_agent_uid',
    'test_partner_uid',
    'test_customer_uid',
  ];

  const existingUsers = await knex('users').select('id').whereIn('firebase_uid', testFirebaseUids);
  const existingUserIds = existingUsers.map((user) => user.id);

  if (existingUserIds.length > 0) {
    const existingPartners = await knex('partners').select('id').whereIn('user_id', existingUserIds);
    const existingPartnerIds = existingPartners.map((partner) => partner.id);

    if (existingPartnerIds.length > 0) {
      await knex('orders').whereIn('partner_id', existingPartnerIds).update({ partner_id: null });
    }

    const existingAgents = await knex('agents').select('id').whereIn('user_id', existingUserIds);
    const existingAgentIds = existingAgents.map((agent) => agent.id);

    const customerOrderRows = await knex('orders').select('id').whereIn('customer_id', existingUserIds);
    const customerOrderIds = customerOrderRows.map((row) => row.id);

    if (customerOrderIds.length > 0) {
      await knex('order_items').whereIn('order_id', customerOrderIds).del();
      await knex('payments').whereIn('order_id', customerOrderIds).del();
      await knex('notifications').whereIn('order_id', customerOrderIds).del();
      await knex('deliveries').whereIn('order_id', customerOrderIds).del();
      await knex('orders').whereIn('id', customerOrderIds).del();
    }

    if (existingAgentIds.length > 0) {
      await knex('deliveries').whereIn('agent_id', existingAgentIds).del();
      await knex('agents').whereIn('id', existingAgentIds).del();
    }

    if (existingPartnerIds.length > 0) {
      await knex('partners').whereIn('id', existingPartnerIds).del();
    }

    await knex('addresses').whereIn('user_id', existingUserIds).del();
    await knex('notifications').whereIn('user_id', existingUserIds).del();
    await knex('users').whereIn('id', existingUserIds).del();
  }

  const serviceItems = await knex('service_items').select('id', 'price').orderBy('display_order', 'asc').limit(3);

  if (serviceItems.length < 2) {
    throw new Error('Seed 003_test_data requires at least 2 service_items. Run 001_services_and_items first.');
  }

  const [adminUser] = await knex('users')
    .insert({
      firebase_uid: 'test_admin_uid',
      name: 'Admin',
      phone: '+919999999999',
      email: 'admin@rapidry.test',
      role: 'admin',
      is_active: true,
    })
    .returning('*');

  const [agentUser] = await knex('users')
    .insert({
      firebase_uid: 'test_agent_uid',
      name: 'Ravi Kumar',
      phone: '+919999999998',
      email: 'ravi.agent@rapidry.test',
      role: 'agent',
      is_active: true,
    })
    .returning('*');

  const [partnerUser] = await knex('users')
    .insert({
      firebase_uid: 'test_partner_uid',
      name: 'CleanWash Hub',
      phone: '+919999999997',
      email: 'partner@rapidry.test',
      role: 'partner',
      is_active: true,
    })
    .returning('*');

  const [customerUser] = await knex('users')
    .insert({
      firebase_uid: 'test_customer_uid',
      name: 'Test Customer',
      phone: '+919999999996',
      email: 'customer@rapidry.test',
      role: 'customer',
      is_active: true,
    })
    .returning('*');

  const [agent] = await knex('agents')
    .insert({
      user_id: agentUser.id,
      is_online: true,
      zone: 'Sector 44',
      rating: 5.0,
      total_deliveries: 10,
    })
    .returning('*');

  const [partner] = await knex('partners')
    .insert({
      user_id: partnerUser.id,
      name: 'CleanWash Hub',
      phone: '+919999999997',
      email: 'partner@rapidry.test',
      address: 'Sector 44, Gurgaon',
      zone: 'Sector 44',
      is_active: true,
    })
    .returning('*');

  const [homeAddress, workAddress] = await knex('addresses')
    .insert([
      {
        user_id: customerUser.id,
        label: 'home',
        full_address: 'House 21, Sector 44, Gurgaon',
        landmark: 'Near Community Center',
        is_default: true,
      },
      {
        user_id: customerUser.id,
        label: 'work',
        full_address: 'Tower B, Cyber City, Gurgaon',
        landmark: 'DLF Building 5',
        is_default: false,
      },
    ])
    .returning('*');

  const [placedOrder, deliveredOrder] = await knex('orders')
    .insert([
      {
        order_number: 'RD-9001',
        customer_id: customerUser.id,
        address_id: homeAddress.id,
        partner_id: partner.id,
        status: 'placed',
        total: 180,
        delivery_fee: 30,
        discount: 0,
        payment_status: 'pending',
        payment_method: 'cod',
        pickup_date: '2026-03-25',
        pickup_slot: '9:00 AM - 11:00 AM',
        special_instructions: 'Call before arrival',
      },
      {
        order_number: 'RD-9002',
        customer_id: customerUser.id,
        address_id: workAddress.id,
        partner_id: partner.id,
        status: 'delivered',
        total: 320,
        delivery_fee: 30,
        discount: 20,
        payment_status: 'paid',
        payment_method: 'upi',
        pickup_date: '2026-03-22',
        pickup_slot: '2:00 PM - 4:00 PM',
        special_instructions: null,
      },
    ])
    .returning('*');

  await knex('order_items').insert([
    {
      order_id: placedOrder.id,
      service_item_id: serviceItems[0].id,
      quantity: 2,
      unit_price: Number(serviceItems[0].price),
      total_price: Number(serviceItems[0].price) * 2,
      processing_status: 'pending',
      is_processed: false,
    },
    {
      order_id: placedOrder.id,
      service_item_id: serviceItems[1].id,
      quantity: 1,
      unit_price: Number(serviceItems[1].price),
      total_price: Number(serviceItems[1].price),
      processing_status: 'pending',
      is_processed: false,
    },
    {
      order_id: deliveredOrder.id,
      service_item_id: serviceItems[0].id,
      quantity: 3,
      unit_price: Number(serviceItems[0].price),
      total_price: Number(serviceItems[0].price) * 3,
      processing_status: 'processed',
      is_processed: true,
    },
  ]);

  await knex('payments').insert({
    order_id: deliveredOrder.id,
    amount: deliveredOrder.total,
    currency: 'INR',
    method: 'upi',
    status: 'captured',
    razorpay_order_id: 'order_test_9002',
    razorpay_payment_id: 'pay_test_9002',
    razorpay_signature: 'test_signature_9002',
  });

  await knex('deliveries').insert([
    {
      order_id: placedOrder.id,
      agent_id: agent.id,
      type: 'pickup',
      status: 'assigned',
    },
    {
      order_id: deliveredOrder.id,
      agent_id: agent.id,
      type: 'pickup',
      status: 'completed',
      started_at: knex.fn.now(),
      completed_at: knex.fn.now(),
    },
    {
      order_id: deliveredOrder.id,
      agent_id: agent.id,
      type: 'drop',
      status: 'completed',
      started_at: knex.fn.now(),
      completed_at: knex.fn.now(),
    },
  ]);
};
