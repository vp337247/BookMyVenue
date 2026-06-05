import { BookingsRepository } from '../repositories/bookings.repository';
import { PaymentsRepository } from '../../payments/repositories/payments.repository';
import { PaymentsService } from '../../payments/payments.service';
import { Booking } from '../booking.entity';
import { BookingStatus } from '../../../common/enums/booking-status.enum';
import { PaymentStatus } from '../../../common/enums/payment-status.enum';
import { BaseError } from '../../../common/errors/base.error';

export class CreateBookingUseCase {
  private readonly bookingsRepo: BookingsRepository;
  private readonly paymentsRepo: PaymentsRepository;
  private readonly paymentsService: PaymentsService;

  constructor(dependencies: {
    bookingsRepo: BookingsRepository;
    paymentsRepo: PaymentsRepository;
    paymentsService: PaymentsService;
  }) {
    this.bookingsRepo = dependencies.bookingsRepo;
    this.paymentsRepo = dependencies.paymentsRepo;
    this.paymentsService = dependencies.paymentsService;
  }

  async execute(params: {
    userId: string;
    venueId: string;
    startTime: Date;
    endTime: Date;
  }): Promise<{ booking: Booking; paymentUrl: string; sessionId: string }> {
    const { userId, venueId, startTime, endTime } = params;

    const venue = await this.bookingsRepo.findVenueById(venueId);
    if (!venue) {
      throw new BaseError('Venue not found.', 404);
    }

    const isOverlapping = await this.bookingsRepo.checkOverlap(venueId, startTime, endTime);
    if (isOverlapping) {
      throw new BaseError('This timeslot is already booked.', 400);
    }

    const startMs = new Date(startTime).getTime();
    const endMs = new Date(endTime).getTime();
    const hours = (endMs - startMs) / (1000 * 60 * 60);
    if (hours <= 0) {
      throw new BaseError('Invalid booking duration.', 400);
    }
    const totalPrice = hours * venue.pricePerHour;

    const booking = await this.bookingsRepo.createBooking({
      venue_id: venueId,
      user_id: userId,
      start_time: startTime,
      end_time: endTime,
      total_price: totalPrice,
      status: BookingStatus.PENDING,
    });

    const session = await this.paymentsService.createCheckoutSession({
      bookingId: booking.id,
      amount: totalPrice,
      venueName: venue.name,
    });

    await this.paymentsRepo.createPayment({
      bookingId: booking.id,
      stripeSessionId: session.id,
      amount: totalPrice,
      currency: session.currency || 'usd',
      status: PaymentStatus.PENDING,
    });

    // Populate relation details
    booking.venue = venue;

    return {
      booking,
      paymentUrl: session.url,
      sessionId: session.id,
    };
  }
}
