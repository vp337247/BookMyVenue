import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('bookings', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('venue_id').notNullable();
    table.foreign('venue_id').references('id').inTable('venues').onDelete('CASCADE');
    table.uuid('user_id').notNullable();
    table.foreign('user_id').references('id').inTable('user_account').onDelete('CASCADE');
    table.timestamp('start_time').notNullable();
    table.timestamp('end_time').notNullable();
    table.double('total_price').notNullable();
    table.string('status').notNullable().defaultTo('PENDING'); // PENDING, APPROVED, REJECTED, CANCELLED
    table.timestamps(true, true);

    table.index('venue_id');
    table.index('user_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('bookings');
}
