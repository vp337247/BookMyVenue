import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Find Dave's user account to set as owner
  const dave = await knex('user_account').where({ email: 'dave@owner.com' }).first();

  if (!dave) {
    throw new Error('Owner Dave not found. Run 2_seed_users first.');
  }

  // Insert mock venues
  await knex('venues').insert([
    {
      name: 'The Glasshouse Loft',
      description: 'An aesthetic rooftop loft with panoramic views, perfect for co-working, creative brainstorms, and community meetups.',
      type: 'COWORKING',
      location: 'Downtown Arts District',
      price_per_hour: 45.0,
      capacity: 25,
      amenities: JSON.stringify(['Wi-Fi', 'Coffee Bar', 'Projector', 'Air Conditioned']),
      image_urls: JSON.stringify(['https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80']),
      owner_id: dave.id,
    },
    {
      name: 'Starlight Outdoor Garden',
      description: 'A lush, open-air green space adorned with fairy lights. Excellent for social gatherings, pop-up events, and celebrations.',
      type: 'GATHERING',
      location: 'Suburban Greenway',
      price_per_hour: 110.0,
      capacity: 80,
      amenities: JSON.stringify(['Catering Area', 'Parking', 'Sound System', 'Pet Friendly']),
      image_urls: JSON.stringify(['https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80']),
      owner_id: dave.id,
    },
    {
      name: 'Neon Cyberpunk Studio',
      description: 'A premium creative production studio equipped with customizable smart RGB lighting, professional backdrops, and green screens.',
      type: 'CREATIVE',
      location: 'Warehouse District',
      price_per_hour: 75.0,
      capacity: 12,
      amenities: JSON.stringify(['AV Equipment', 'RGB Lighting', 'Green Screen', 'Dressing Room']),
      image_urls: JSON.stringify(['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80']),
      owner_id: dave.id,
    }
  ]);
}
