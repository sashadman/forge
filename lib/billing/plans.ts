export type BillingAudience = 'employer' | 'provider'

export type BillingPlan = {
  id: string
  audience: BillingAudience
  name: string
  priceIdEnv: string
  fallbackHref: string
}

export const billingPlans = [
  {
    id: 'employer-starter',
    audience: 'employer',
    name: 'Employer Starter',
    priceIdEnv: 'STRIPE_EMPLOYER_STARTER_PRICE_ID',
    fallbackHref: '/employers/sign-up',
  },
  {
    id: 'employer-pro',
    audience: 'employer',
    name: 'Employer Pro',
    priceIdEnv: 'STRIPE_EMPLOYER_PRO_PRICE_ID',
    fallbackHref: '/employers/sign-up',
  },
  {
    id: 'provider-growth',
    audience: 'provider',
    name: 'Provider Growth',
    priceIdEnv: 'STRIPE_PROVIDER_GROWTH_PRICE_ID',
    fallbackHref: '/training-providers/claim',
  },
  {
    id: 'provider-pro',
    audience: 'provider',
    name: 'Provider Pro',
    priceIdEnv: 'STRIPE_PROVIDER_PRO_PRICE_ID',
    fallbackHref: '/training-providers/claim',
  },
] as const satisfies BillingPlan[]

export type BillingPlanId = (typeof billingPlans)[number]['id']

export function getBillingPlan(planId: string) {
  return billingPlans.find((plan) => plan.id === planId) ?? null
}

export function getBillingPriceId(plan: BillingPlan) {
  return process.env[plan.priceIdEnv] ?? ''
}
