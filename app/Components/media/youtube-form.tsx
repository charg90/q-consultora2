"use client"

import { CardFooter } from "@/components/ui/card"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

interface YouTubeFormProps {
  onSuccess?: () => void
}

export function YouTubeForm({ onSuccess }: YouTubeFormProps) {
  const [youtubeId, setYoutubeId] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startTime, setStartTime] = useState(0)
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
        setError("Debes iniciar sesión para agregar videos")
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

      // Insertar el video en la base de datos
      const { error: insertError } = await supabase.from("youtube_videos").insert({
        youtube_id: videoId,
        title,
        description,
        thumbnail_url: thumbnailUrl,
        start_time: startTime,
        user_id: user.id,
      })

      if (insertError) {
        setError(insertError.message)
      } else {
        // Limpiar el formulario
        setYoutubeId("")
        setTitle("")
        setDescription("")
        setStartTime(0)

        // Llamar a la función de éxito si existe
        if (onSuccess) {
          onSuccess()
        }
      }
    } catch (err) {
      console.error("Error al agregar video:", err)
      setError("Ocurrió un error al agregar el video")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Agregar Video de YouTube</CardTitle>
        <CardDescription>Añade un nuevo video de YouTube a tu colección</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="youtube-id">ID o URL de YouTube</Label>
            <Input
              id="youtube-id"
              placeholder="https://www.youtube.com/watch?v=XXXX o XXXX"
              value={youtubeId}
              onChange={(e) => setYoutubeId(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Título del video"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Descripción del video"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="start-time">Tiempo de inicio (segundos)</Label>
            <Input
              id="start-time"
              type="number"
              min="0"
              value={startTime}
              onChange={(e) => setStartTime(Number.parseInt(e.target.value) || 0)}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Agregando..." : "Agregar Video"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
