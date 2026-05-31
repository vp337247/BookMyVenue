import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Fetch Alice and the Glasshouse Loft
  const alice = await knex('user_account').where({ email: 'alice@organizer.com' }).first();
  const glasshouse = await knex('venues').where({ name: 'The Glasshouse Loft' }).first();

  if (!alice || !glasshouse) {
    throw new Error('Required customer account or venue missing. Run seeds 2 and 3 first.');
  }

  // Define booking hours (next week, 4 hours duration)
  const nextWeekStart = new Date();
  nextWeekStart.setDate(nextWeekStart.getDate() + 7);
  nextWeekStart.setHours(14, 0, 0, 0); // 2:00 PM

  const nextWeekEnd = new Date(nextWeekStart);
  nextWeekEnd.setHours(18, 0, 0, 0); // 6:00 PM

  // Insert mock booking
  await knex('bookings').insert({
    venue_id: glasshouse.id,
    user_id: alice.id,
    start_time: nextWeekStart,
    end_time: nextWeekEnd,
    total_price: Number(glasshouse.price_per_hour) * 4,
    status: 'APPROVED',
  });
}
