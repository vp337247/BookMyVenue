import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Clear all existing data in safe dependent order
  await knex('bookings').del();
  await knex('venues').del();
  await knex('user_auth').del();
  await knex('user_account').del();
  await knex('roles').del();

  // Insert standard system roles
  await knex('roles').insert([
    { code: 'ADMIN', name: 'System Administrator' },
    { code: 'OWNER', name: 'Venue Owner' },
    { code: 'USER', name: 'Customer' }
  ]);
}
