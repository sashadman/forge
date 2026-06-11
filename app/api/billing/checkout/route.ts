import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getBillingPlan, getBillingPriceId } from '@/lib/billing/plans'
import { getStripe } from '@/lib/stripe/server'

function getOrigin(request: NextRequest) {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    request.nextUrl.origin
  )
}

function pricingRedirect(request: NextRequest, error: string) {
  const url = new URL('/pricing', request.nextUrl.origin)
  url.searchParams.set('billing_error', error)
  return NextResponse.redirect(url, { status: 303 })
}

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const planId = String(formData.get('planId') ?? '')
  const plan = getBillingPlan(planId)

  if (!plan) {
    return pricingRedirect(request, 'unknown-plan')
  }

  const priceId = getBillingPriceId(plan)

  if (!priceId) {
    return pricingRedirect(request, 'missing-price')
  }

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const origin = getOrigin(request)
  const stripe = getStripe()

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: user?.email,
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
    success_url: `${origin}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pricing?checkout=cancelled`,
    client_reference_id: user?.id,
    subscription_data: {
      metadata: {
        plan_id: plan.id,
        audience: plan.audience,
        user_id: user?.id ?? '',
      },
    },
    metadata: {
      plan_id: plan.id,
      audience: plan.audience,
      user_id: user?.id ?? '',
    },
  })

  if (!session.url) {
    return pricingRedirect(request, 'checkout-session')
  }

  return NextResponse.redirect(session.url, { status: 303 })
}
