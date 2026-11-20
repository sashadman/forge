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

type BillingCustomerRow = {
  stripe_customer_id: string | null
}

type BillingCustomerTable = {
  select: (columns: string) => {
    eq: (column: string, value: string) => {
      maybeSingle: () => Promise<{ data: BillingCustomerRow | null }>
    }
  }
}

type LooseAdminClient = {
  from: (table: 'billing_customers') => BillingCustomerTable
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

  const admin = createAdminClient() as unknown as LooseAdminClient
  const { data: billingCustomer } = await admin
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
