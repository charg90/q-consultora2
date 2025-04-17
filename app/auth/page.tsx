import { AuthForm } from "../Components/auth/auth-form";


export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 via-zinc-900 to-slate-900 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-white mb-8">Accede a tu Cuenta</h1>
        <AuthForm />
      </div>
    </div>
  )
}
