"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface AuthorDisplayProps {
  userId: string
  createdAt: string
  size?: "sm" | "md" | "lg"
}

export function AuthorDisplay({ userId, createdAt, size = "md" }: AuthorDisplayProps) {
  const [profile, setProfile] = useState<{
    full_name: string | null
    username: string | null
    avatar_url: string | null
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true)
        setError(null)

        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, username, avatar_url")
          .eq("id", userId)
          .single()

        if (error) {
          throw error
        }

        setProfile(data)
      } catch (err) {
        console.error("Error al cargar el perfil:", err)
        setError("No se pudo cargar la información del autor")
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      loadProfile()
    }
  }, [userId, supabase])

  // Determinar el tamaño del avatar según la prop size
  const avatarSize = size === "sm" ? "h-8 w-8" : size === "lg" ? "h-12 w-12" : "h-10 w-10"
  const textSize = size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm"

  // Formatear la fecha relativa (ej: "hace 2 días")
  const formattedDate = createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: es }) : ""

  if (loading) {
    return (
      <div className="flex items-center gap-3 animate-pulse">
        <div className={`${avatarSize} rounded-full bg-zinc-800`}></div>
        <div className="space-y-2">
          <div className="h-4 w-24 bg-zinc-800 rounded"></div>
          <div className="h-3 w-16 bg-zinc-800 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="flex items-center gap-3">
        <Avatar className={avatarSize}>
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div>
          <p className={`${textSize} font-medium text-gray-300`}>Usuario desconocido</p>
          <p className={`${textSize} text-gray-500`}>{formattedDate}</p>
        </div>
      </div>
    )
  }

  // Determinar el nombre a mostrar (nombre completo, nombre de usuario o "Usuario")
  const displayName = profile.full_name || profile.username || "Usuario"

  // Obtener las iniciales para el fallback del avatar
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)

  return (
    <div className="flex items-center gap-3">
      <Avatar className={avatarSize}>
        <AvatarImage src={profile.avatar_url || ""} alt={displayName} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div>
        <p className={`${textSize} font-medium text-gray-300`}>{displayName}</p>
        <p className={`${textSize} text-gray-500`}>{formattedDate}</p>
      </div>
    </div>
  )
}
