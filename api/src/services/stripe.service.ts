import Stripe from "stripe";

class StripeService {
  private client?: Stripe;

  private getClient(): Stripe {
    if (this.client) return this.client;

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    this.client = new Stripe(secretKey);
    return this.client;
  }

  createCheckoutSession(params: Stripe.Checkout.SessionCreateParams) {
    return this.getClient().checkout.sessions.create(params);
  }

  constructWebhookEvent(
    payload: string | Buffer,
    signature: string,
  ): Stripe.Event {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
    }

    return this.getClient().webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );
  }
}

export const stripeService = new StripeService();
