"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, Save, Loader2 } from "lucide-react"
import { compressImage } from "@/utils/image-compression"
import { toast } from "@/hooks/use-toast"
import type { Database } from "@/lib/database.types"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fullName, setFullName] = useState("")
  const [username, setUsername] = useState("")
  const [website, setWebsite] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [compressing, setCompressing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true)
        setError(null)

        // Verificar si el usuario está autenticado
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.push("/auth")
          return
        }

        setUser(session.user)

        // Obtener el perfil del usuario
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()

        if (profileError) {
          throw profileError
        }

        setProfile(profileData)
        setFullName(profileData.full_name || "")
        setUsername(profileData.username || "")
        setWebsite(profileData.website || "")
        setImagePreview(profileData.avatar_url)
      } catch (err) {
        console.error("Error al cargar el perfil:", err)
        setError("No se pudo cargar la información del perfil")
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [supabase, router])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null

    if (!file) {
      return
    }

    // Validar tamaño máximo (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("La imagen es demasiado grande. El tamaño máximo es 2MB.")
      return
    }

    try {
      setCompressing(true)

      // Comprimir la imagen
      const compressedFile = await compressImage(file, 0.5, 300) // Tamaño más pequeño para avatares
      setImageFile(compressedFile)

      // Crear una URL para la vista previa de la imagen
      const previewUrl = URL.createObjectURL(compressedFile)
      setImagePreview(previewUrl)
    } catch (err) {
      console.error("Error al comprimir la imagen:", err)
      setError("Error al procesar la imagen. Por favor, intenta con otra.")
    } finally {
      setCompressing(false)
    }
  }

  const handleClickUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const uploadProfileImage = async (userId: string): Promise<string | null> => {
    if (!imageFile) return profile?.avatar_url || null

    try {
      // Crear un nombre único para el archivo en una carpeta "avatars" dentro del bucket "media"
      const fileExt = imageFile.name.split(".").pop()
      const fileName = `avatars/avatar-${userId}-${Date.now()}.${fileExt}`

      // Subir el archivo a Supabase Storage en el bucket "media"
      const { error: uploadError, data } = await supabase.storage.from("media").upload(fileName, imageFile, {
        cacheControl: "3600",
        upsert: false,
      })

      if (uploadError) {
        throw new Error(uploadError.message)
      }

      // Obtener la URL pública del archivo
      const {
        data: { publicUrl },
      } = supabase.storage.from("media").getPublicUrl(fileName)

      return publicUrl
    } catch (error) {
      console.error("Error al subir la imagen de perfil:", error)
      return profile?.avatar_url || null
    }
  }

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      setError(null)

      if (!user) {
        setError("Debes iniciar sesión para actualizar tu perfil")
        return
      }

      // Subir la imagen de perfil si existe
      let avatarUrl = profile?.avatar_url || null
      if (imageFile) {
        avatarUrl = await uploadProfileImage(user.id)
      }

      // Actualizar el perfil del usuario
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          username,
          full_name: fullName,
          website,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (updateError) {
        throw updateError
      }

      toast({
        title: "Perfil actualizado",
        description: "Tu perfil ha sido actualizado correctamente.",
      })

      // Actualizar el perfil en el estado
      setProfile({
        ...profile!,
        username,
        full_name: fullName,
        website,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
    } catch (err) {
      console.error("Error al actualizar el perfil:", err)
      setError("Ocurrió un error al actualizar el perfil")

      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

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

  // Determinar el nombre a mostrar (nombre completo, nombre de usuario o "Usuario")
  const displayName = fullName || username || "Usuario"

  // Obtener las iniciales para el fallback del avatar
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-zinc-900 to-slate-900">
      <header className="bg-black/50 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" className="text-white mr-2" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Panel
            </Button>
            <h1 className="text-2xl font-bold text-white">Tu Perfil</h1>
          </div>
          <Button variant="ghost" className="text-white" onClick={handleSignOut}>
            Cerrar Sesión
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Información de Perfil</CardTitle>
              <CardDescription>Actualiza tu información personal y foto de perfil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

                <div className="relative mb-4">
                  <Avatar className="h-24 w-24 cursor-pointer" onClick={handleClickUpload}>
                    {compressing ? (
                      <AvatarFallback>
                        <Loader2 className="h-8 w-8 animate-spin" />
                      </AvatarFallback>
                    ) : (
                      <>
                        <AvatarImage src={imagePreview || ""} alt={displayName} />
                        <AvatarFallback>{initials}</AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  <div
                    className="absolute bottom-0 right-0 bg-zinc-800 rounded-full p-1.5 cursor-pointer hover:bg-zinc-700 transition-colors border border-zinc-700"
                    onClick={handleClickUpload}
                  >
                    <Upload className="h-4 w-4 text-white" />
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-4">Haz clic en la imagen para cambiarla</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input id="email" type="email" value={user?.email || ""} disabled className="bg-zinc-800/50" />
                  <p className="text-xs text-gray-500">El correo electrónico no se puede cambiar</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="full-name">Nombre Completo</Label>
                  <Input
                    id="full-name"
                    type="text"
                    placeholder="Tu nombre completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Nombre de Usuario</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="usuario123"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Sitio Web</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://ejemplo.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-900/30 border border-red-800 rounded-md">
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleSaveProfile} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
