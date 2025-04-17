"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Upload, Link, ImageIcon, Info } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { compressImage, formatFileSize } from "@/utils/image-compression"
import type { Database } from "@/lib/database.types"

type LinkedInPost = Database["public"]["Tables"]["linkedin_posts"]["Row"]

interface LinkedInEditFormProps {
  post: LinkedInPost
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function LinkedInEditForm({ post, isOpen, onClose, onSuccess }: LinkedInEditFormProps) {
  const [linkedinUrl, setLinkedinUrl] = useState(post.linkedin_url)
  const [title, setTitle] = useState(post.title || "")
  const [description, setDescription] = useState(post.description || "")
  const [thumbnailUrl, setThumbnailUrl] = useState(post.thumbnail_url || "")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(post.thumbnail_url)
  const [loading, setLoading] = useState(false)
  const [compressing, setCompressing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [compressionStats, setCompressionStats] = useState<{
    original: number
    compressed: number
    savings: number
  } | null>(null)
  const [activeTab, setActiveTab] = useState(post.thumbnail_url ? "url" : "upload")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supabase = createClient()

  // Actualizar los estados cuando cambia el post
  useEffect(() => {
    setLinkedinUrl(post.linkedin_url)
    setTitle(post.title || "")
    setDescription(post.description || "")
    setThumbnailUrl(post.thumbnail_url || "")
    setImagePreview(post.thumbnail_url)
    setActiveTab(post.thumbnail_url ? "url" : "upload")
  }, [post])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null

    if (!file) {
      setImageFile(null)
      setOriginalFile(null)
      setImagePreview(post.thumbnail_url)
      setCompressionStats(null)
      return
    }

    setOriginalFile(file)

    // Validar tamaño máximo (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("El archivo es demasiado grande. El tamaño máximo es 5MB.")
      return
    }

    try {
      setCompressing(true)

      // Comprimir la imagen
      const compressedFile = await compressImage(file, 1, 1920)
      setImageFile(compressedFile)

      // Calcular estadísticas de compresión
      const originalSize = file.size
      const compressedSize = compressedFile.size
      const savings = originalSize - compressedSize

      setCompressionStats({
        original: originalSize,
        compressed: compressedSize,
        savings: savings,
      })

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

  const uploadImage = async (file: File, userId: string): Promise<string> => {
    try {
      // Crear un nombre único para el archivo (directamente en la raíz del bucket)
      const fileExt = file.name.split(".").pop()
      const fileName = `${userId}-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`

      // Subir el archivo a Supabase Storage (directamente en la raíz)
      const { error: uploadError, data } = await supabase.storage.from("media").upload(fileName, file, {
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
      console.error("Error al subir la imagen:", error)
      throw error
    }
  }

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
        setError("Debes iniciar sesión para editar publicaciones")
        return
      }

      // Validar URL de LinkedIn
      if (!linkedinUrl.includes("linkedin.com")) {
        setError("URL de LinkedIn inválida")
        return
      }

      let finalThumbnailUrl = thumbnailUrl

      // Si hay un archivo de imagen, subirlo a Supabase Storage
      if (imageFile && activeTab === "upload") {
        try {
          finalThumbnailUrl = await uploadImage(imageFile, user.id)
        } catch (err) {
          console.error("Error al subir la imagen:", err)
          setError("Error al subir la imagen. Por favor, inténtalo de nuevo.")
          setLoading(false)
          return
        }
      }

      // Actualizar la publicación en la base de datos
      const { error: updateError } = await supabase
        .from("linkedin_posts")
        .update({
          linkedin_url: linkedinUrl,
          title,
          description,
          thumbnail_url: finalThumbnailUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", post.id)

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
      console.error("Error al actualizar publicación:", err)
      setError("Ocurrió un error al actualizar la publicación")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Publicación de LinkedIn</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="linkedin-url-edit">URL de LinkedIn</Label>
              <Input
                id="linkedin-url-edit"
                placeholder="https://www.linkedin.com/feed/update/urn:li:activity:XXXX"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title-edit">Título</Label>
              <Input
                id="title-edit"
                placeholder="Título de la publicación"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description-edit">Descripción</Label>
              <Textarea
                id="description-edit"
                placeholder="Descripción de la publicación"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label>Imagen de miniatura</Label>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="url" className="flex items-center gap-2">
                    <Link className="h-4 w-4" />
                    URL
                  </TabsTrigger>
                  <TabsTrigger value="upload" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Subir
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="url" className="mt-0">
                  <Input
                    id="thumbnail-url-edit"
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
                </TabsContent>

                <TabsContent value="upload" className="mt-0">
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
                        className="border-2 border-dashed border-gray-700 rounded-lg p-8 w-full flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 transition-colors"
                      >
                        {compressing ? (
                          <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mb-2"></div>
                            <p className="text-sm text-gray-400">Comprimiendo imagen...</p>
                          </div>
                        ) : (
                          <>
                            <ImageIcon className="h-10 w-10 text-gray-500 mb-2" />
                            <p className="text-sm text-gray-400 text-center">
                              Haz clic para seleccionar una imagen
                              <br />
                              <span className="text-xs">JPG, PNG, GIF (máx. 5MB)</span>
                            </p>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="w-full">
                        <div className="mt-2 rounded-md overflow-hidden border border-gray-700 relative group">
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt="Vista previa"
                            className="w-full h-40 object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button type="button" variant="secondary" size="sm" onClick={handleClickUpload}>
                              Cambiar imagen
                            </Button>
                          </div>
                        </div>

                        {compressionStats && (
                          <div className="mt-2 p-2 bg-zinc-800/50 rounded-md text-xs text-gray-300 flex items-start gap-2">
                            <Info className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-blue-400">Imagen comprimida automáticamente</p>
                              <p>Original: {formatFileSize(compressionStats.original)}</p>
                              <p>Comprimida: {formatFileSize(compressionStats.compressed)}</p>
                              <p>
                                Ahorro: {formatFileSize(compressionStats.savings)} (
                                {Math.round((compressionStats.savings / compressionStats.original) * 100)}%)
                              </p>
                            </div>
                          </div>
                        )}

                        {imageFile && (
                          <p className="text-xs text-gray-400 mt-1">
                            {imageFile.name} ({formatFileSize(imageFile.size || 0)})
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || compressing}>
              {loading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
