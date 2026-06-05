import { ObjectType, Field } from '@nestjs/graphql';
import { Booking } from '../booking.entity';

@ObjectType()
export class BookingResult {
  @Field(() => Booking)
  booking: Booking;

  @Field(() => String, { nullable: true })
  paymentUrl?: string;

  @Field(() => String, { nullable: true })
  sessionId?: string;
}
