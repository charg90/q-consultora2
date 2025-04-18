"use client"

import type React from "react"

import { useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { Upload, User } from "lucide-react"
import { compressImage } from "@/utils/image-compression"
import Image from "next/image"
import { toast } from "@/hooks/use-toast"

export function AuthForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [compressing, setCompressing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()
  const supabase = createClient()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null

    if (!file) {
      setImageFile(null)
      setImagePreview(null)
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
    if (!imageFile) return null

    try {
      // Crear un nombre único para el archivo en una carpeta "avatars" dentro del bucket "media"
      const fileExt = imageFile.name.split(".").pop()
      const fileName = `avatars/avatar-${userId}-${Date.now()}.${fileExt}`

      console.log("[Avatar Upload] Subiendo archivo:", fileName)
      // Subir el archivo a Supabase Storage en el bucket "media"
      const { error: uploadError, data } = await supabase.storage.from("media").upload(fileName, imageFile, {
        cacheControl: "3600",
        upsert: false,
      })
      console.log("[Avatar Upload] Resultado upload:", { uploadError, data })

      if (uploadError) {
        console.error("[Avatar Upload] Error al subir:", uploadError)
        return null
      }

      // Obtener la URL pública del archivo
      const { data: publicUrlData } = supabase.storage.from("media").getPublicUrl(fileName)
      console.log("[Avatar Upload] Resultado getPublicUrl:", publicUrlData)

      if (!publicUrlData || !publicUrlData.publicUrl) {
        console.error("[Avatar Upload] No se pudo obtener la URL pública del avatar")
        return null
      }

      return publicUrlData.publicUrl
    } catch (error) {
      console.error("[Avatar Upload] Error inesperado:", error)
      return null
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 1. Registrar al usuario
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName || null,
            username: username || null,

          },
        },
      })

      if (authError) {
        setError(authError.message)
        return
      }

      if (!authData.user) {
        setError("No se pudo crear el usuario")
        return
      }
        console.log(imageFile)
      // 2. Subir la imagen de perfil si existe
      let avatarUrl = null
      if (imageFile) {
        avatarUrl = await uploadProfileImage(authData.user.id)
      }

   
      // 3. Crear el perfil del usuario - Esto ahora lo maneja un trigger en Supabase
      // Pero actualizamos el avatar_url si se subió una imagen
      if (avatarUrl) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            avatar_url: avatarUrl,
            updated_at: new Date().toISOString(),
            default_role_id: 2
          })
          .eq("id", authData.user.id)

        if (updateError) {
          console.error("Error al actualizar el avatar:", updateError)
          // No interrumpimos el flujo por un error en la actualización del avatar
        }
      }

      // Mostrar mensaje de verificación de correo
      toast({
        title: "Registro exitoso",
        description: "¡Revisa tu correo para verificar tu cuenta!",
      })

      setError("¡Revisa tu correo para verificar tu cuenta!")
    } catch (err) {
      console.error("Error durante el registro:", err)
      setError("Ocurrió un error durante el registro")
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      console.error("Error durante el inicio de sesión:", err)
      setError("Ocurrió un error durante el inicio de sesión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <Tabs defaultValue="login">
        <CardHeader>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="register">Registrarse</TabsTrigger>
          </TabsList>
       
        </CardHeader>

        <TabsContent value="login">
          <form onSubmit={handleSignIn}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>

        <TabsContent value="register">
          <form onSubmit={handleSignUp}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-email">Correo Electrónico</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="tu@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Contraseña</Label>
                <Input
                  id="register-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
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
                <Label>Imagen de Perfil</Label>
                <div className="flex flex-col items-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  {!imagePreview ? (
                    <div
                      onClick={handleClickUpload}
                      className="border-2 border-dashed border-gray-700 rounded-lg p-6 w-full flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 transition-colors"
                    >
                      {compressing ? (
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mb-2"></div>
                          <p className="text-sm text-gray-400">Comprimiendo imagen...</p>
                        </div>
                      ) : (
                        <>
                          <User className="h-10 w-10 text-gray-500 mb-2" />
                          <p className="text-sm text-gray-400 text-center">
                            Haz clic para seleccionar una imagen de perfil
                            <br />
                            <span className="text-xs">JPG, PNG (máx. 2MB)</span>
                          </p>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="w-full flex flex-col items-center">
                      <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-700 mb-2">
                        <Image
                          src={imagePreview || "/placeholder.svg"}
                          alt="Vista previa"
                          fill
                          className="object-cover"
                        />
                        <div
                          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                          onClick={handleClickUpload}
                        >
                          <Upload className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <p className="text-xs text-gray-400">Haz clic en la imagen para cambiarla</p>
                    </div>
                  )}
                </div>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Registrando..." : "Registrarse"}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
