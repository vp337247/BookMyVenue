import { registerAs } from '@nestjs/config';

export const stripeConfig = registerAs('stripe', () => {
  return {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    successUrl: process.env.STRIPE_SUCCESS_URL,
    cancelUrl: process.env.STRIPE_CANCEL_URL,
  };
});
