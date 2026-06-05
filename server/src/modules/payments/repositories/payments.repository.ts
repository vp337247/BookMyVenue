import { Knex } from 'knex';
import { Payment, mapDbPaymentToEntity } from '../payment.entity';
import { PaymentStatus } from '../../../common/enums/payment-status.enum';

export class PaymentsRepository {
  constructor(private readonly db: Knex | Knex.Transaction) {}

  async createPayment(data: {
    bookingId: string;
    stripeSessionId: string;
    amount: number;
    currency?: string;
    status: PaymentStatus;
  }): Promise<Payment> {
    const [row] = await this.db('payments')
      .insert({
        booking_id: data.bookingId,
        stripe_session_id: data.stripeSessionId,
        amount: data.amount,
        currency: data.currency || 'usd',
        status: data.status,
      })
      .returning('*');
    return mapDbPaymentToEntity(row);
  }

  async confirmPayment(stripeSessionId: string, stripePaymentIntentId: string): Promise<Payment> {
    const payment = await this.db('payments').where({ stripe_session_id: stripeSessionId }).first();
    if (!payment) {
      throw new Error(`Payment record not found for Stripe Session: ${stripeSessionId}`);
    }

    const [updatedPaymentRow] = await this.db('payments')
      .where({ id: payment.id })
      .update({
        status: PaymentStatus.COMPLETED,
        stripe_payment_intent_id: stripePaymentIntentId,
        updated_at: new Date(),
      })
      .returning('*');

    return mapDbPaymentToEntity(updatedPaymentRow);
  }

  async failPayment(stripeSessionId: string): Promise<void> {
    const payment = await this.db('payments').where({ stripe_session_id: stripeSessionId }).first();
    if (!payment) return;

    await this.db('payments')
      .where({ id: payment.id })
      .update({
        status: PaymentStatus.FAILED,
        updated_at: new Date(),
      });
  }

  async findPaymentBySessionId(stripeSessionId: string): Promise<Payment | null> {
    const row = await this.db('payments').where({ stripe_session_id: stripeSessionId }).first();
    return mapDbPaymentToEntity(row);
  }
}
