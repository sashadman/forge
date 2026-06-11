import AuthForm from '@/components/auth/AuthForm'

export default function SignInPage() {
  return (
    <main className="page-shell flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
      <AuthForm mode="sign-in" />
    </main>
  )
}
