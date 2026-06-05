import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('payments', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('booking_id').notNullable();
    table.foreign('booking_id').references('id').inTable('bookings').onDelete('CASCADE');
    table.string('stripe_session_id').notNullable();
    table.string('stripe_payment_intent_id').nullable();
    table.double('amount').notNullable();
    table.string('currency').notNullable().defaultTo('usd');
    table.enum('status', ['PENDING', 'COMPLETED', 'FAILED'], {
      useNative: true,
      enumName: 'payment_status',
    }).notNullable().defaultTo('PENDING');
    table.timestamps(true, true);

    table.index('booking_id');
    table.index('stripe_session_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('payments');
  await knex.raw('DROP TYPE IF EXISTS payment_status;');
}
