"use client"

import type React from "react"
import { useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Upload, Link, ImageIcon, Info } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { compressImage, formatFileSize } from "@/utils/image-compression"

interface LinkedInFormProps {
  onSuccess?: () => void
}

export function LinkedInForm({ onSuccess }: LinkedInFormProps) {
  const [linkedinUrl, setLinkedinUrl] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [thumbnailUrl, setThumbnailUrl] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [compressing, setCompressing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [compressionStats, setCompressionStats] = useState<{
    original: number
    compressed: number
    savings: number
  } | null>(null)
  const [activeTab, setActiveTab] = useState("url")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()
  const supabase = createClient()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null

    if (!file) {
      setImageFile(null)
      setOriginalFile(null)
      setImagePreview(null)
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
        setError("Debes iniciar sesión para agregar publicaciones")
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

      // Insertar la publicación en la base de datos
      const { error: insertError, data: newPost } = await supabase
        .from("linkedin_posts")
        .insert({
          linkedin_url: linkedinUrl,
          title,
          description,
          thumbnail_url: finalThumbnailUrl,
          user_id: user.id,
        })
        .select()

      if (insertError) {
        setError(insertError.message)
      } else {
        // Limpiar el formulario
        setLinkedinUrl("")
        setTitle("")
        setDescription("")
        setThumbnailUrl("")
        setImageFile(null)
        setOriginalFile(null)
        setImagePreview(null)
        setCompressionStats(null)
        setActiveTab("url")

        // Llamar a la función de éxito si existe
        if (onSuccess) {
          onSuccess()
        }
      }
    } catch (err) {
      console.error("Error al agregar publicación:", err)
      setError("Ocurrió un error al agregar la publicación")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
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

                      <p className="text-xs text-gray-400 mt-1">
                        {imageFile?.name} ({formatFileSize(imageFile?.size || 0)})
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading || compressing}>
            {loading ? "Agregando..." : "Agregar Publicación"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
