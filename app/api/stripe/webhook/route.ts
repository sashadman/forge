import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStripe } from '@/lib/stripe/server'

export const dynamic = 'force-dynamic'

function getTimestamp(seconds: number | null | undefined) {
  return seconds ? new Date(seconds * 1000).toISOString() : null
}

async function recordBillingEvent(event: Stripe.Event) {
  const admin = createAdminClient()

  await (admin as any).from('billing_events').upsert({
    stripe_event_id: event.id,
    type: event.type,
    payload: event as any,
    processed_at: new Date().toISOString(),
  })
}

async function syncSubscription(subscription: Stripe.Subscription) {
  const admin = createAdminClient()
  const customerId =
    typeof subscription.customer === 'string'
      ? subscription.customer
      : subscription.customer.id
  const userId = subscription.metadata.user_id || null
  const priceId = subscription.items.data[0]?.price.id ?? null

  if (userId) {
    await (admin as any).from('billing_customers').upsert(
      {
        user_id: userId,
        stripe_customer_id: customerId,
        email: null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'stripe_customer_id' }
    )
  }

  await (admin as any).from('billing_subscriptions').upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      stripe_price_id: priceId,
      plan_id: subscription.metadata.plan_id || null,
      audience: subscription.metadata.audience || null,
      status: subscription.status,
      current_period_start: getTimestamp(subscription.current_period_start),
      current_period_end: getTimestamp(subscription.current_period_end),
      cancel_at_period_end: subscription.cancel_at_period_end,
      metadata: subscription.metadata,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'stripe_subscription_id' }
  )
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const admin = createAdminClient()
  const userId = session.metadata?.user_id || session.client_reference_id || null
  const customerId =
    typeof session.customer === 'string'
      ? session.customer
      : session.customer?.id

  if (userId && customerId) {
    await (admin as any).from('billing_customers').upsert(
      {
        user_id: userId,
        stripe_customer_id: customerId,
        email: session.customer_details?.email ?? session.customer_email ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'stripe_customer_id' }
    )
  }
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    return NextResponse.json(
      { error: 'Missing STRIPE_WEBHOOK_SECRET' },
      { status: 500 }
    )
  }

  const stripe = getStripe()
  const body = await request.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid signature'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
      break
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      await syncSubscription(event.data.object as Stripe.Subscription)
      break
    default:
      break
  }

  await recordBillingEvent(event)

  return NextResponse.json({ received: true })
}
