import { BookingsRepository } from '../repositories/bookings.repository';
import { Booking } from '../booking.entity';

export class GetMyBookingsUseCase {
  private readonly bookingsRepo: BookingsRepository;

  constructor(dependencies: { bookingsRepo: BookingsRepository }) {
    this.bookingsRepo = dependencies.bookingsRepo;
  }

  async execute(params: { userId: string }): Promise<Booking[]> {
    return this.bookingsRepo.findUserBookings(params.userId);
  }
}
