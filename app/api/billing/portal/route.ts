import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStripe } from '@/lib/stripe/server'

function getOrigin(request: NextRequest) {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    request.nextUrl.origin
  )
}

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.nextUrl.origin), {
      status: 303,
    })
  }

  const admin = createAdminClient()
  const { data: billingCustomer } = await (admin as any)
    .from('billing_customers')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!billingCustomer?.stripe_customer_id) {
    return NextResponse.redirect(new URL('/pricing?billing_error=no-customer', request.nextUrl.origin), {
      status: 303,
    })
  }

  const stripe = getStripe()
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: billingCustomer.stripe_customer_id,
    return_url: `${getOrigin(request)}/pricing`,
  })

  return NextResponse.redirect(portalSession.url, { status: 303 })
}
