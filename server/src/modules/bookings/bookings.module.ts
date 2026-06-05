import { Module } from '@nestjs/common';
import { BookingsResolver } from './bookings.resolver';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [PaymentsModule],
  providers: [BookingsResolver],
})
export class BookingsModule {}
