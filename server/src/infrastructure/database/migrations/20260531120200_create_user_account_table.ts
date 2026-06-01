import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  await knex.schema.createTable('user_account', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('email', 255).unique().notNullable();
    table.string('first_name', 255).notNullable();
    table.string('last_name', 255).nullable();
    table.string('phone_number', 50).unique().notNullable();
    table.string('country_code', 10).notNullable();
    table.string('role_code').notNullable();
    table.string('password_reset_token').unique().nullable();
    table.timestamp('password_reset_token_exp_at').nullable();
    table.timestamps(true, true);

    table.foreign('role_code').references('code').inTable('roles').onDelete('RESTRICT');

    table.index('email');
    table.index('role_code');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('user_account');
}
