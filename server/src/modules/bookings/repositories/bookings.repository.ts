import { Knex } from 'knex';
import { Booking, mapDbBookingToEntity } from '../booking.entity';
import { Venue, mapDbVenueToEntity } from '../../../venues/venue.entity';
import { BookingStatus } from '../../../common/enums/booking-status.enum';

export class BookingsRepository {
  constructor(private readonly db: Knex | Knex.Transaction) {}

  async checkOverlap(venueId: string, startTime: Date, endTime: Date): Promise<boolean> {
    const overlap = await this.db('bookings')
      .where('venue_id', venueId)
      .whereIn('status', [BookingStatus.PENDING, BookingStatus.APPROVED])
      .where((builder) => {
        builder.where('start_time', '<', endTime)
               .andWhere('end_time', '>', startTime);
      })
      .first();
    return !!overlap;
  }

  async findUserBookings(userId: string): Promise<Booking[]> {
    const rows = await this.db('bookings as b')
      .select(
        'b.*',
        'v.name as venue_name',
        'v.description as venue_description',
        'v.type as venue_type',
        'v.location as venue_location',
        'v.price_per_hour as venue_price_per_hour',
        'v.capacity as venue_capacity',
        'v.amenities as venue_amenities',
        'v.image_urls as venue_image_urls',
        'v.owner_id as venue_owner_id',
        'p.id as payment_id',
        'p.stripe_session_id',
        'p.stripe_payment_intent_id',
        'p.amount as payment_amount',
        'p.currency as payment_currency',
        'p.status as payment_status',
        'p.created_at as payment_created_at',
        'p.updated_at as payment_updated_at'
      )
      .leftJoin('venues as v', 'b.venue_id', 'v.id')
      .leftJoin('payments as p', 'b.id', 'p.booking_id')
      .where('b.user_id', userId)
      .orderBy('b.created_at', 'desc');

    return rows.map(mapDbBookingToEntity).filter(Boolean) as Booking[];
  }

  async findBookingById(id: string): Promise<Booking | null> {
    const row = await this.db('bookings as b')
      .select(
        'b.*',
        'v.name as venue_name',
        'v.description as venue_description',
        'v.type as venue_type',
        'v.location as venue_location',
        'v.price_per_hour as venue_price_per_hour',
        'v.capacity as venue_capacity',
        'v.amenities as venue_amenities',
        'v.image_urls as venue_image_urls',
        'v.owner_id as venue_owner_id',
        'p.id as payment_id',
        'p.stripe_session_id',
        'p.stripe_payment_intent_id',
        'p.amount as payment_amount',
        'p.currency as payment_currency',
        'p.status as payment_status',
        'p.created_at as payment_created_at',
        'p.updated_at as payment_updated_at'
      )
      .leftJoin('venues as v', 'b.venue_id', 'v.id')
      .leftJoin('payments as p', 'b.id', 'p.booking_id')
      .where('b.id', id)
      .first();

    return mapDbBookingToEntity(row);
  }

  async findBookingByStripeSessionId(stripeSessionId: string): Promise<Booking | null> {
    const row = await this.db('bookings as b')
      .select(
        'b.*',
        'v.name as venue_name',
        'v.description as venue_description',
        'v.type as venue_type',
        'v.location as venue_location',
        'v.price_per_hour as venue_price_per_hour',
        'v.capacity as venue_capacity',
        'v.amenities as venue_amenities',
        'v.image_urls as venue_image_urls',
        'v.owner_id as venue_owner_id',
        'p.id as payment_id',
        'p.stripe_session_id',
        'p.stripe_payment_intent_id',
        'p.amount as payment_amount',
        'p.currency as payment_currency',
        'p.status as payment_status',
        'p.created_at as payment_created_at',
        'p.updated_at as payment_updated_at'
      )
      .leftJoin('venues as v', 'b.venue_id', 'v.id')
      .leftJoin('payments as p', 'b.id', 'p.booking_id')
      .where('p.stripe_session_id', stripeSessionId)
      .first();

    return mapDbBookingToEntity(row);
  }

  async findVenueById(venueId: string): Promise<Venue | null> {
    const row = await this.db('venues').where({ id: venueId }).first();
    return mapDbVenueToEntity(row);
  }

  async createBooking(data: {
    venue_id: string;
    user_id: string;
    start_time: Date;
    end_time: Date;
    total_price: number;
    status: BookingStatus;
  }): Promise<Booking> {
    const [row] = await this.db('bookings')
      .insert(data)
      .returning('*');
    return mapDbBookingToEntity(row);
  }

  async updateBookingStatus(bookingId: string, status: BookingStatus): Promise<void> {
    await this.db('bookings')
      .where({ id: bookingId })
      .update({
        status,
        updated_at: new Date(),
      });
  }

  async updateBookingStatusBySessionId(stripeSessionId: string, status: BookingStatus): Promise<void> {
    const payment = await this.db('payments').where({ stripe_session_id: stripeSessionId }).first();
    if (!payment) return;
    await this.updateBookingStatus(payment.booking_id, status);
  }
}
