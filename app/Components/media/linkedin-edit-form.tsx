"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import type { Database } from "@/lib/database.types"

type LinkedInPost = Database["public"]["Tables"]["linkedin_posts"]["Row"]

interface LinkedInEditFormProps {
  post: LinkedInPost
  isOpen: boolean
  onClose: () => void
}

export function LinkedInEditForm({ post, isOpen, onClose }: LinkedInEditFormProps) {
  const [linkedinUrl, setLinkedinUrl] = useState(post.linkedin_url)
  const [title, setTitle] = useState(post.title || "")
  const [description, setDescription] = useState(post.description || "")
  const [thumbnailUrl, setThumbnailUrl] = useState(post.thumbnail_url || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (isOpen) {
      setLinkedinUrl(post.linkedin_url)
      setTitle(post.title || "")
      setDescription(post.description || "")
      setThumbnailUrl(post.thumbnail_url || "")
      setError(null)
    }
  }, [isOpen, post])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validar URL de LinkedIn
      if (!linkedinUrl.includes("linkedin.com")) {
        setError("URL de LinkedIn inválida")
        return
      }

      // Actualizar la publicación en la base de datos
      const { error: updateError } = await supabase
        .from("linkedin_posts")
        .update({
          linkedin_url: linkedinUrl,
          title,
          description,
          thumbnail_url: thumbnailUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", post.id)

      if (updateError) {
        setError(updateError.message)
      } else {
        router.refresh()
        onClose()
      }
    } catch (err) {
      console.error("Error al actualizar publicación:", err)
      setError("Ocurrió un error al actualizar la publicación")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Publicación de LinkedIn</DialogTitle>
          <DialogDescription>Actualiza la información de la publicación</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-linkedin-url">URL de LinkedIn</Label>
              <Input
                id="edit-linkedin-url"
                placeholder="https://www.linkedin.com/feed/update/urn:li:activity:XXXX"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Título</Label>
              <Input
                id="edit-title"
                placeholder="Título de la publicación"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Descripción</Label>
              <Textarea
                id="edit-description"
                placeholder="Descripción de la publicación"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-thumbnail-url">URL de la imagen (opcional)</Label>
              <Input
                id="edit-thumbnail-url"
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
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
