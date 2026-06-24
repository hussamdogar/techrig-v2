import "server-only";
import Stripe from "stripe";

/**
 * Server-only Stripe client (M4). TEST keys in dev/.env.local; the publishable
 * key is the only Stripe value that reaches the browser (via the payment route).
 * The secret key and webhook secret are never sent to the client or logged.
 */
let client: Stripe | null = null;

export function stripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY");
  if (!client) client = new Stripe(key);
  return client;
}
