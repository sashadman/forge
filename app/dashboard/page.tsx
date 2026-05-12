import { siteConfig } from '@/config/site'

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
          Dashboard
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
          Welcome to {siteConfig.name}
        </h1>

        <p className="mt-4 max-w-lg text-slate-600">
          Your account authentication is working correctly.
        </p>
      </div>
    </main>
  )
}