import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('user_otp_codes', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('email', 255).notNullable();
    table.string('otp_code', 6).notNullable();
    table.enum('purpose_code', ['VERIFY_EMAIL', 'RESET_PASSWORD'], {
      useNative: true,
      enumName: 'otp_purpose',
    }).notNullable().defaultTo('VERIFY_EMAIL');
    table.integer('attempts').notNullable().defaultTo(0);
    table.boolean('is_consumed').notNullable().defaultTo(false);
    table.timestamp('expires_at').notNullable();
    table.timestamp('last_attempt_at').nullable();
    table.timestamps(true, true);

    table.index(['email']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('user_otp_codes');
  await knex.raw('DROP TYPE IF EXISTS otp_purpose;');
}
