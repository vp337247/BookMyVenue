import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.get<string>('stripe.secretKey');
    this.stripe = new Stripe(secretKey || 'placeholder_secret', {
      apiVersion: '2024-04-10' as Stripe.StripeConfig['apiVersion'],
    });
  }

  async createCheckoutSession(params: {
    bookingId: string;
    amount: number;
    currency?: string;
    venueName: string;
  }): Promise<Stripe.Checkout.Session> {
    const successUrl = this.configService.get<string>('stripe.successUrl');
    const cancelUrl = this.configService.get<string>('stripe.cancelUrl');

    try {
      return await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: params.currency || 'usd',
              product_data: {
                name: params.venueName,
                description: `Booking reservation for venue: ${params.venueName}`,
              },
              unit_amount: Math.round(params.amount * 100), // Stripe expects amount in cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          bookingId: params.bookingId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(`Stripe session creation failed: ${error.message}`);
    }
  }

  async retrieveCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    try {
      return await this.stripe.checkout.sessions.retrieve(sessionId);
    } catch (error) {
      throw new InternalServerErrorException(`Stripe session retrieval failed: ${error.message}`);
    }
  }

  constructEvent(payload: string | Buffer, signature: string): Stripe.Event {
    const webhookSecret = this.configService.get<string>('stripe.webhookSecret');
    try {
      return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret || 'placeholder_secret');
    } catch (error) {
      throw new Error(`Webhook signature verification failed: ${error.message}`);
    }
  }
}
