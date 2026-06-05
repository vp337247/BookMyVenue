import { ObjectType, Field, ID, Float, registerEnumType } from '@nestjs/graphql';
import { PaymentStatus } from '../../common/enums/payment-status.enum';

registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
  description: 'The status of a payment',
});

@ObjectType()
export class Payment {
  @Field(() => ID)
  id: string;

  @Field()
  bookingId: string;

  @Field()
  stripeSessionId: string;

  @Field({ nullable: true })
  stripePaymentIntentId?: string;

  @Field(() => Float)
  amount: number;

  @Field()
  currency: string;

  @Field(() => PaymentStatus)
  status: PaymentStatus;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export function mapDbPaymentToEntity(dbPayment: any): Payment | null {
  if (!dbPayment) return null;
  return {
    id: dbPayment.id,
    bookingId: dbPayment.booking_id,
    stripeSessionId: dbPayment.stripe_session_id,
    stripePaymentIntentId: dbPayment.stripe_payment_intent_id || undefined,
    amount: Number(dbPayment.amount),
    currency: dbPayment.currency,
    status: dbPayment.status as PaymentStatus,
    createdAt: new Date(dbPayment.created_at),
    updatedAt: new Date(dbPayment.updated_at),
  };
}
