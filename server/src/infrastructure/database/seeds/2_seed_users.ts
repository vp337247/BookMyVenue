import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Fetch seeded role records to map foreign keys
  const ownerRole = await knex('roles').where({ code: 'OWNER' }).first();
  const userRole = await knex('roles').where({ code: 'USER' }).first();

  if (!ownerRole || !userRole) {
    throw new Error('Required roles missing in DB. Run 1_seed_roles first.');
  }

  // Insert Dave - Venue Owner
  const [ownerAccount] = await knex('user_account').insert({
    email: 'dave@owner.com',
    first_name: 'Dave',
    last_name: 'Owner',
    role_id: ownerRole.id,
  }).returning('*');

  await knex('user_auth').insert({
    user_account_id: ownerAccount.id,
    password_salt: '$2b$10$9S7m9uK9F.v2K4W8M4lHZe',
    password_hash: '$2b$10$9S7m9uK9F.v2K4W8M4lHZe35gM28Y1uL7mR2uR4vF1jQ5jW7mP2uS',
  });

  // Insert Alice - Customer / Organizer
  const [organizerAccount] = await knex('user_account').insert({
    email: 'alice@organizer.com',
    first_name: 'Alice',
    last_name: 'Organizer',
    role_id: userRole.id,
  }).returning('*');

  await knex('user_auth').insert({
    user_account_id: organizerAccount.id,
    password_salt: '$2b$10$9S7m9uK9F.v2K4W8M4lHZe',
    password_hash: '$2b$10$9S7m9uK9F.v2K4W8M4lHZe35gM28Y1uL7mR2uR4vF1jQ5jW7mP2uS',
  });
}
