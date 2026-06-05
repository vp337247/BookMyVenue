import { BookingsRepository } from '../repositories/bookings.repository';
import { PaymentsRepository } from '../../payments/repositories/payments.repository';
import { PaymentsService } from '../../payments/payments.service';
import { Booking } from '../booking.entity';
import { BaseError } from '../../../common/errors/base.error';
import { BookingStatus } from '../../../common/enums/booking-status.enum';

export class ConfirmBookingUseCase {
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

  async execute(params: { sessionId: string }): Promise<Booking | null> {
    const { sessionId } = params;

    const session = await this.paymentsService.retrieveCheckoutSession(sessionId);
    if (!session) {
      throw new BaseError('Stripe checkout session not found.', 404);
    }

    if (session.payment_status === 'paid') {
      const paymentIntentId = session.payment_intent as string;
      await this.paymentsRepo.confirmPayment(sessionId, paymentIntentId);
      await this.bookingsRepo.updateBookingStatusBySessionId(sessionId, BookingStatus.APPROVED);
    } else {
      throw new BaseError(`Stripe payment is not completed. Current status: ${session.payment_status}`, 400);
    }

    return this.bookingsRepo.findBookingByStripeSessionId(sessionId);
  }
}
