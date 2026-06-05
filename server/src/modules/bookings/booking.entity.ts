import { ObjectType, Field, ID, Float, registerEnumType } from '@nestjs/graphql';
import { Venue } from '../../venues/venue.entity';
import { Payment } from '../payments/payment.entity';
import { BookingStatus } from '../../common/enums/booking-status.enum';
import { PaymentStatus } from '../../common/enums/payment-status.enum';

registerEnumType(BookingStatus, {
  name: 'BookingStatus',
  description: 'The status of a booking',
});

@ObjectType()
export class Booking {
  @Field(() => ID)
  id: string;

  @Field()
  venueId: string;

  @Field(() => Venue, { nullable: true })
  venue?: Venue;

  @Field(() => Payment, { nullable: true })
  payment?: Payment;

  @Field()
  userId: string;

  @Field()
  startTime: Date;

  @Field()
  endTime: Date;

  @Field(() => Float)
  totalPrice: number;

  @Field(() => BookingStatus)
  status: BookingStatus;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export function mapDbBookingToEntity(dbBooking: any): Booking | null {
  if (!dbBooking) return null;
  const booking: Booking = {
    id: dbBooking.id,
    venueId: dbBooking.venue_id,
    userId: dbBooking.user_id,
    startTime: new Date(dbBooking.start_time),
    endTime: new Date(dbBooking.end_time),
    totalPrice: Number(dbBooking.total_price),
    status: dbBooking.status as BookingStatus,
    createdAt: new Date(dbBooking.created_at),
    updatedAt: new Date(dbBooking.updated_at),
  };

  if (dbBooking.venue_name) {
    booking.venue = {
      id: dbBooking.venue_id,
      name: dbBooking.venue_name,
      description: dbBooking.venue_description,
      type: dbBooking.venue_type,
      location: dbBooking.venue_location,
      pricePerHour: Number(dbBooking.venue_price_per_hour),
      capacity: Number(dbBooking.venue_capacity),
      amenities: Array.isArray(dbBooking.venue_amenities) ? dbBooking.venue_amenities : JSON.parse(dbBooking.venue_amenities || '[]'),
      imageUrls: Array.isArray(dbBooking.venue_image_urls) ? dbBooking.venue_image_urls : JSON.parse(dbBooking.venue_image_urls || '[]'),
      ownerId: dbBooking.venue_owner_id,
      createdAt: dbBooking.venue_created_at ? new Date(dbBooking.venue_created_at) : new Date(),
      updatedAt: dbBooking.venue_updated_at ? new Date(dbBooking.venue_updated_at) : new Date(),
    };
  }

  if (dbBooking.payment_id) {
    booking.payment = {
      id: dbBooking.payment_id,
      bookingId: dbBooking.id,
      stripeSessionId: dbBooking.stripe_session_id,
      stripePaymentIntentId: dbBooking.stripe_payment_intent_id || undefined,
      amount: Number(dbBooking.payment_amount),
      currency: dbBooking.payment_currency || 'usd',
      status: dbBooking.payment_status as PaymentStatus,
      createdAt: dbBooking.payment_created_at ? new Date(dbBooking.payment_created_at) : new Date(),
      updatedAt: dbBooking.payment_updated_at ? new Date(dbBooking.payment_updated_at) : new Date(),
    };
  }

  return booking;
}
