import 'server-only'
import Stripe from 'stripe'

let stripeClient: Stripe | null = null

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY

  if (!secretKey) {
    throw new Error('Missing STRIPE_SECRET_KEY')
  }

  stripeClient ??= new Stripe(secretKey, {
    apiVersion: '2024-04-10',
    typescript: true,
  })

  return stripeClient
}
