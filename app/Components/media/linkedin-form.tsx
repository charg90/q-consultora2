"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export function LinkedInForm() {
  const [linkedinUrl, setLinkedinUrl] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [thumbnailUrl, setThumbnailUrl] = useState("") // Nuevo estado para la URL de la imagen
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Obtener el usuario actual
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError("Debes iniciar sesión para agregar publicaciones")
        return
      }

      // Validar URL de LinkedIn
      if (!linkedinUrl.includes("linkedin.com")) {
        setError("URL de LinkedIn inválida")
        return
      }

      // Insertar la publicación en la base de datos
      const { error: insertError } = await supabase.from("linkedin_posts").insert({
        linkedin_url: linkedinUrl,
        title,
        description,
        thumbnail_url: thumbnailUrl, // Guardar la URL de la imagen
        user_id: user.id,
      })

      if (insertError) {
        setError(insertError.message)
      } else {
        // Redirigir o mostrar mensaje de éxito
        router.refresh()
        setLinkedinUrl("")
        setTitle("")
        setDescription("")
        setThumbnailUrl("") // Limpiar la URL de la imagen
      }
    } catch (err) {
      console.error("Error al agregar publicación:", err)
      setError("Ocurrió un error al agregar la publicación")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agregar Publicación de LinkedIn</CardTitle>
        <CardDescription>Añade una nueva publicación de LinkedIn a tu colección</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="linkedin-url">URL de LinkedIn</Label>
            <Input
              id="linkedin-url"
              placeholder="https://www.linkedin.com/feed/update/urn:li:activity:XXXX"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Título de la publicación"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Descripción de la publicación"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="thumbnail-url">URL de la imagen (opcional)</Label>
            <Input
              id="thumbnail-url"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
            />
            {thumbnailUrl && (
              <div className="mt-2 rounded-md overflow-hidden border border-gray-700">
                <img
                  src={thumbnailUrl || "/placeholder.svg"}
                  alt="Vista previa"
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/generic-placeholder-image.png"
                    setError("La URL de la imagen no es válida o no está disponible")
                  }}
                />
              </div>
            )}
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Agregando..." : "Agregar Publicación"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
