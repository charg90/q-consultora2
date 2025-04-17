"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { LogOut, ArrowLeft } from "lucide-react"
import { StorageManager } from "@/app/Components/storage/storage-manager"

export default function StoragePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkUser() {
      try {
        // Verificar si el usuario está autenticado
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.push("/auth")
          return
        }

        setUser(session.user)
      } catch (error) {
        console.error("Error checking user:", error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [supabase, router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/auth")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-zinc-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-zinc-900 to-slate-900">
      <header className="bg-black/50 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" className="text-white mr-2" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <h1 className="text-2xl font-bold text-white">Gestor de Almacenamiento</h1>
          </div>
          <Button variant="ghost" className="text-white" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <StorageManager />
      </main>
    </div>
  )
}
