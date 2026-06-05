import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { DatabaseService } from '../../infrastructure/database/database.service';
import { PaymentsService } from '../payments/payments.service';
import { Booking } from './booking.entity';
import { BookingResult } from './dto/booking.result';
import { CreateBookingInput } from './dto/create-booking.input';
import { CreateBookingSchema } from './schema/create-booking.schema';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { BookingsRepository } from './repositories/bookings.repository';
import { PaymentsRepository } from '../payments/repositories/payments.repository';
import { CreateBookingUseCase } from './use-cases/create-booking.use-case';
import { ConfirmBookingUseCase } from './use-cases/confirm-booking.use-case';
import { GetMyBookingsUseCase } from './use-cases/get-my-bookings.use-case';
import { mapToHttpException } from '../../common/utils/exception-mapper.util';

@Resolver(() => Booking)
export class BookingsResolver {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly paymentsService: PaymentsService,
  ) {}

  @Mutation(() => BookingResult, { description: 'Initiate a new booking and get a Stripe payment URL' })
  @UseGuards(GqlAuthGuard)
  async createBooking(
    @Args('input', new ZodValidationPipe(CreateBookingSchema)) input: CreateBookingInput,
    @CurrentUser() user: JwtPayload,
  ): Promise<BookingResult> {
    try {
      const userId = user.sub;
      return await this.dbService.runUnitOfWork({
        useTransaction: true,
        buildDependencies: async ({ db }) => ({
          bookingsRepo: new BookingsRepository(db),
          paymentsRepo: new PaymentsRepository(db),
        }),
        callback: async ({ bookingsRepo, paymentsRepo }) => {
          const useCase = new CreateBookingUseCase({
            bookingsRepo,
            paymentsRepo,
            paymentsService: this.paymentsService,
          });
          return await useCase.execute({
            userId,
            venueId: input.venueId,
            startTime: input.startTime,
            endTime: input.endTime,
          });
        },
      });
    } catch (error) {
      throw mapToHttpException(error);
    }
  }

  @Mutation(() => Booking, { nullable: true, description: 'Confirm booking payment by verifying Stripe Session ID directly' })
  @UseGuards(GqlAuthGuard)
  async confirmBooking(
    @Args('sessionId', { type: () => String }) sessionId: string,
  ): Promise<Booking | null> {
    try {
      return await this.dbService.runUnitOfWork({
        useTransaction: true,
        buildDependencies: async ({ db }) => ({
          bookingsRepo: new BookingsRepository(db),
          paymentsRepo: new PaymentsRepository(db),
        }),
        callback: async ({ bookingsRepo, paymentsRepo }) => {
          const useCase = new ConfirmBookingUseCase({
            bookingsRepo,
            paymentsRepo,
            paymentsService: this.paymentsService,
          });
          return await useCase.execute({ sessionId });
        },
      });
    } catch (error) {
      throw mapToHttpException(error);
    }
  }

  @Query(() => [Booking], { name: 'myBookings', description: 'Retrieve booking history for the logged-in user' })
  @UseGuards(GqlAuthGuard)
  async getMyBookings(@CurrentUser() user: JwtPayload): Promise<Booking[]> {
    try {
      const userId = user.sub;
      return await this.dbService.runUnitOfWork({
        useTransaction: false,
        buildDependencies: async ({ db }) => ({
          bookingsRepo: new BookingsRepository(db),
        }),
        callback: async ({ bookingsRepo }) => {
          const useCase = new GetMyBookingsUseCase({ bookingsRepo });
          return await useCase.execute({ userId });
        },
      });
    } catch (error) {
      throw mapToHttpException(error);
    }
  }
}
