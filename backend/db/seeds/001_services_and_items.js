exports.seed = async function seed(knex) {
  await knex('service_items').del();
  await knex('services').del();

  const servicesToInsert = [
    {
      name: 'Wash & Fold',
      description: 'Expert machine wash with careful folding',
      base_price: 49,
      price_unit: 'per_kg',
      display_order: 1,
    },
    {
      name: 'Wash & Iron',
      description: 'Machine wash followed by crisp ironing',
      base_price: 79,
      price_unit: 'per_kg',
      display_order: 2,
    },
    {
      name: 'Dry Clean',
      description: 'Professional dry cleaning for delicate fabrics',
      base_price: 199,
      price_unit: 'per_item',
      display_order: 3,
    },
    {
      name: 'Steam Iron',
      description: 'Professional steam pressing for wrinkle-free finish',
      base_price: 29,
      price_unit: 'per_item',
      display_order: 4,
    },
    {
      name: 'Shoe Cleaning',
      description: 'Deep cleaning and restoration for all shoe types',
      base_price: 149,
      price_unit: 'per_item',
      display_order: 5,
    },
    {
      name: 'Bag Cleaning',
      description: 'Gentle cleaning for bags and accessories',
      base_price: 249,
      price_unit: 'per_item',
      display_order: 6,
    },
  ];

  const insertedServices = await knex('services')
    .insert(servicesToInsert)
    .returning(['id', 'name']);

  const serviceIdByName = insertedServices.reduce((acc, service) => {
    acc[service.name] = service.id;
    return acc;
  }, {});

  const serviceItemsByService = {
    'Wash & Fold': [
      ['Shirt', 35],
      ['T-Shirt', 30],
      ['Trousers', 40],
      ['Jeans', 50],
      ['Shorts', 25],
      ['Bedsheet (Single)', 50],
      ['Bedsheet (Double)', 70],
      ['Pillow Cover', 20],
      ['Towel', 30],
      ['Curtain (per panel)', 60],
    ],
    'Wash & Iron': [
      ['Shirt', 45],
      ['T-Shirt', 40],
      ['Trousers', 55],
      ['Jeans', 65],
      ['Kurta', 50],
      ['Saree', 80],
    ],
    'Dry Clean': [
      ['Suit (2-piece)', 399],
      ['Blazer', 299],
      ['Coat', 349],
      ['Sherwani', 499],
      ['Lehenga', 599],
      ['Saree (Silk)', 349],
      ['Dress', 249],
      ['Jacket', 249],
    ],
    'Steam Iron': [
      ['Shirt', 29],
      ['T-Shirt', 25],
      ['Trousers', 35],
      ['Saree', 45],
      ['Kurta', 30],
      ['Suit (2-piece)', 80],
    ],
    'Shoe Cleaning': [
      ['Sneakers', 149],
      ['Formal Shoes', 129],
      ['Boots', 199],
      ['Sandals', 99],
    ],
    'Bag Cleaning': [
      ['Handbag (Small)', 249],
      ['Handbag (Large)', 349],
      ['Backpack', 199],
      ['Laptop Bag', 249],
    ],
  };

  const serviceItemsToInsert = [];

  Object.entries(serviceItemsByService).forEach(([serviceName, items]) => {
    const serviceId = serviceIdByName[serviceName];

    items.forEach(([itemName, price], index) => {
      serviceItemsToInsert.push({
        service_id: serviceId,
        name: itemName,
        price,
        unit: 'per_item',
        display_order: index + 1,
      });
    });
  });

  await knex('service_items').insert(serviceItemsToInsert);
};
