import AuthForm from '@/components/auth/AuthForm'

export default function SignUpPage() {
  return (
    <main className="page-shell flex min-h-screen items-center justify-center px-6 py-16">
      <AuthForm mode="sign-up" />
    </main>
  )
}