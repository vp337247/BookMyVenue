import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('venues', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name').notNullable();
    table.text('description').notNullable();
    table.string('type').notNullable();
    table.string('location').notNullable();
    table.double('price_per_hour').notNullable();
    table.integer('capacity').notNullable();
    table.jsonb('amenities').notNullable().defaultTo('[]');
    table.jsonb('image_urls').notNullable().defaultTo('[]');
    table.uuid('owner_id').notNullable();
    table.foreign('owner_id').references('id').inTable('user_account').onDelete('CASCADE');
    table.timestamps(true, true);

    table.index('owner_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('venues');
}
