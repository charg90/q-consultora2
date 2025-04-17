"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import type { Database } from "@/lib/database.types"

type YouTubeVideo = Database["public"]["Tables"]["youtube_videos"]["Row"]

interface YouTubeEditFormProps {
  video: YouTubeVideo
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function YouTubeEditForm({ video, isOpen, onClose, onSuccess }: YouTubeEditFormProps) {
  const [youtubeId, setYoutubeId] = useState(video.youtube_id)
  const [title, setTitle] = useState(video.title)
  const [description, setDescription] = useState(video.description || "")
  const [startTime, setStartTime] = useState(video.start_time || 0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  // Actualizar los estados cuando cambia el video
  useEffect(() => {
    setYoutubeId(video.youtube_id)
    setTitle(video.title)
    setDescription(video.description || "")
    setStartTime(video.start_time || 0)
  }, [video])

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
        setError("Debes iniciar sesión para editar videos")
        return
      }

      // Extraer el ID de YouTube si se proporciona una URL completa
      let videoId = youtubeId
      if (youtubeId.includes("youtube.com") || youtubeId.includes("youtu.be")) {
        const url = new URL(youtubeId)
        if (youtubeId.includes("youtube.com")) {
          videoId = url.searchParams.get("v") || ""
        } else {
          videoId = url.pathname.substring(1)
        }
      }

      if (!videoId) {
        setError("ID de YouTube inválido")
        return
      }

      // Obtener la miniatura del video
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

      // Actualizar el video en la base de datos
      const { error: updateError } = await supabase
        .from("youtube_videos")
        .update({
          youtube_id: videoId,
          title,
          description,
          thumbnail_url: thumbnailUrl,
          start_time: startTime,
          updated_at: new Date().toISOString(),
        })
        .eq("id", video.id)

      if (updateError) {
        setError(updateError.message)
      } else {
        // Llamar a la función de éxito si existe
        if (onSuccess) {
          onSuccess()
        }
        onClose()
      }
    } catch (err) {
      console.error("Error al actualizar video:", err)
      setError("Ocurrió un error al actualizar el video")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Video de YouTube</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="youtube-id-edit">ID o URL de YouTube</Label>
              <Input
                id="youtube-id-edit"
                placeholder="https://www.youtube.com/watch?v=XXXX o XXXX"
                value={youtubeId}
                onChange={(e) => setYoutubeId(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title-edit">Título</Label>
              <Input
                id="title-edit"
                placeholder="Título del video"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description-edit">Descripción</Label>
              <Textarea
                id="description-edit"
                placeholder="Descripción del video"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="start-time-edit">Tiempo de inicio (segundos)</Label>
              <Input
                id="start-time-edit"
                type="number"
                min="0"
                value={startTime}
                onChange={(e) => setStartTime(Number.parseInt(e.target.value) || 0)}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
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
