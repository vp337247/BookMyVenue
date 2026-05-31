import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('user_auth', (table) => {
    table.uuid('user_account_id').primary().notNullable();
    table.string('password_salt', 255).notNullable();
    table.string('password_hash', 255).notNullable();
    table.timestamps(true, true);

    table.foreign('user_account_id').references('id').inTable('user_account').onDelete('CASCADE');

    table.index(['user_account_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('user_auth');
}
