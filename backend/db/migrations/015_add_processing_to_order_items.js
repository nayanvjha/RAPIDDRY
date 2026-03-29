exports.up = async function up(knex) {
  const hasIsProcessed = await knex.schema.hasColumn('order_items', 'is_processed');
  const hasProcessingStatus = await knex.schema.hasColumn('order_items', 'processing_status');
  const hasDamageNotes = await knex.schema.hasColumn('order_items', 'damage_notes');
  const hasDamagePhotoUrl = await knex.schema.hasColumn('order_items', 'damage_photo_url');

  await knex.schema.alterTable('order_items', (table) => {
    if (!hasIsProcessed) {
      table.boolean('is_processed').notNullable().defaultTo(false);
    }

    if (!hasProcessingStatus) {
      table.string('processing_status', 30).notNullable().defaultTo('pending');
    }

    if (!hasDamageNotes) {
      table.text('damage_notes').nullable();
    }

    if (!hasDamagePhotoUrl) {
      table.text('damage_photo_url').nullable();
    }
  });
};

exports.down = async function down(knex) {
  const hasIsProcessed = await knex.schema.hasColumn('order_items', 'is_processed');
  const hasProcessingStatus = await knex.schema.hasColumn('order_items', 'processing_status');
  const hasDamageNotes = await knex.schema.hasColumn('order_items', 'damage_notes');
  const hasDamagePhotoUrl = await knex.schema.hasColumn('order_items', 'damage_photo_url');

  await knex.schema.alterTable('order_items', (table) => {
    if (hasDamagePhotoUrl) {
      table.dropColumn('damage_photo_url');
    }

    if (hasDamageNotes) {
      table.dropColumn('damage_notes');
    }

    if (hasProcessingStatus) {
      table.dropColumn('processing_status');
    }

    if (hasIsProcessed) {
      table.dropColumn('is_processed');
    }
  });
};
