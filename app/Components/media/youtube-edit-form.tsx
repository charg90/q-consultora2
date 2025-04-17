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

type YouTubeVideo = Database["public"]["Tables"]["youtube_videos"]["Row"]

interface YouTubeEditFormProps {
  video: YouTubeVideo
  isOpen: boolean
  onClose: () => void
}

export function YouTubeEditForm({ video, isOpen, onClose }: YouTubeEditFormProps) {
  const [youtubeId, setYoutubeId] = useState(video.youtube_id)
  const [title, setTitle] = useState(video.title)
  const [description, setDescription] = useState(video.description || "")
  const [startTime, setStartTime] = useState(video.start_time || 0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (isOpen) {
      setYoutubeId(video.youtube_id)
      setTitle(video.title)
      setDescription(video.description || "")
      setStartTime(video.start_time || 0)
      setError(null)
    }
  }, [isOpen, video])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
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
        router.refresh()
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Video de YouTube</DialogTitle>
          <DialogDescription>Actualiza la información del video</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-youtube-id">ID o URL de YouTube</Label>
              <Input
                id="edit-youtube-id"
                placeholder="https://www.youtube.com/watch?v=XXXX o XXXX"
                value={youtubeId}
                onChange={(e) => setYoutubeId(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Título</Label>
              <Input
                id="edit-title"
                placeholder="Título del video"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Descripción</Label>
              <Textarea
                id="edit-description"
                placeholder="Descripción del video"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-start-time">Tiempo de inicio (segundos)</Label>
              <Input
                id="edit-start-time"
                type="number"
                min="0"
                value={startTime}
                onChange={(e) => setStartTime(Number.parseInt(e.target.value) || 0)}
              />
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
