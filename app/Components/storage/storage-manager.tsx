"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash2, RefreshCw, ExternalLink, AlertCircle, Eye, ImageIcon, FileIcon, Search } from "lucide-react"
import { formatFileSize } from "@/utils/image-compression"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"

type StorageFile = {
  name: string
  id: string
  updated_at: string
  created_at: string
  last_accessed_at: string
  metadata: Record<string, any>
  bucketId: string
  publicUrl: string
  bucket_id?: string
  owner?: string
}

type StorageStats = {
  size: number
  count: number
  usage: number
  limit: number
}

export function StorageManager() {
  const [files, setFiles] = useState<StorageFile[]>([])
  const [unusedFiles, setUnusedFiles] = useState<StorageFile[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<StorageStats>({
    size: 0,
    count: 0,
    usage: 0,
    limit: 1024 * 1024 * 1024, // 1GB límite gratuito
  })
  const [fileToDelete, setFileToDelete] = useState<StorageFile | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [previewFile, setPreviewFile] = useState<StorageFile | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredFiles, setFilteredFiles] = useState<StorageFile[]>([])

  const supabase = createClient()

  // Cargar archivos y estadísticas
  const loadFiles = async () => {
    try {
      setLoading(true)
      setError(null)

      // Obtener lista de archivos (recursivo para incluir subcarpetas)
      const { data: fileList, error: fileError } = await supabase.storage.from("media").list("", {
        limit: 1000,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" },
      })

      if (fileError) {
        throw new Error(fileError.message)
      }

      // Obtener URLs públicas y metadatos para cada archivo
      const filesWithMetadata: StorageFile[] = await Promise.all(
        (fileList || []).map(async (file) => {
          const { data: publicUrlData } = supabase.storage.from("media").getPublicUrl(file.name)

          return {
            ...file,
            publicUrl: publicUrlData.publicUrl,
            bucketId: "media",
          }
        }),
      )

      // Ordenar por fecha de creación (más reciente primero)
      filesWithMetadata.sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })

      setFiles(filesWithMetadata)
      setFilteredFiles(filesWithMetadata)

      // Calcular estadísticas
      const totalSize = filesWithMetadata.reduce((sum, file) => sum + (file.metadata?.size || 0), 0)
      setStats({
        size: totalSize,
        count: filesWithMetadata.length,
        usage: (totalSize / stats.limit) * 100,
        limit: stats.limit,
      })

      // Identificar archivos no utilizados
      await findUnusedFiles(filesWithMetadata)
    } catch (err) {
      console.error("Error al cargar archivos:", err)
      setError(err instanceof Error ? err.message : "Error al cargar archivos")
    } finally {
      setLoading(false)
    }
  }

  // Filtrar archivos según el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredFiles(files)
    } else {
      const term = searchTerm.toLowerCase()
      const filtered = files.filter(
        (file) =>
          file.name.toLowerCase().includes(term) || (file.metadata?.mimetype || "").toLowerCase().includes(term),
      )
      setFilteredFiles(filtered)
    }
  }, [searchTerm, files])

  // Identificar archivos que no están siendo utilizados en ninguna publicación
  const findUnusedFiles = async (filesList: StorageFile[]) => {
    try {
      // Obtener todas las URLs de imágenes en uso
      const { data: linkedinPosts, error: postsError } = await supabase
        .from("linkedin_posts")
        .select("thumbnail_url")
        .not("thumbnail_url", "is", null)

      if (postsError) throw new Error(postsError.message)

      // Crear un conjunto de URLs en uso
      const usedUrls = new Set(linkedinPosts?.map((post) => post.thumbnail_url) || [])

      // Identificar archivos no utilizados
      const unused = filesList.filter((file) => !usedUrls.has(file.publicUrl))
      setUnusedFiles(unused)
    } catch (err) {
      console.error("Error al identificar archivos no utilizados:", err)
    }
  }

  // Verificar si un archivo está siendo utilizado en la base de datos
  const isFileInUse = async (fileUrl: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.from("linkedin_posts").select("id").eq("thumbnail_url", fileUrl).limit(1)

      if (error) throw error

      return data && data.length > 0
    } catch (err) {
      console.error("Error al verificar si el archivo está en uso:", err)
      return false
    }
  }

  // Eliminar un archivo
  const deleteFile = async (file: StorageFile) => {
    try {
      setDeleteLoading(true)
      setError(null)

      console.log("Intentando eliminar archivo:", file.name)

      // Verificar si el archivo está siendo utilizado
      const inUse = await isFileInUse(file.publicUrl)

      if (inUse) {
        // Si el archivo está en uso, primero eliminamos la referencia en la base de datos
        console.log("El archivo está en uso. Actualizando referencia en la base de datos...")

        const { error: dbUpdateError } = await supabase
          .from("linkedin_posts")
          .update({ thumbnail_url: null })
          .eq("thumbnail_url", file.publicUrl)

        if (dbUpdateError) {
          console.error("Error al actualizar registros en la base de datos:", dbUpdateError)
          throw new Error("No se pudo actualizar la referencia en la base de datos: " + dbUpdateError.message)
        }

        // Esperar un momento para que la actualización se propague
        await new Promise((resolve) => setTimeout(resolve, 1000))

        console.log("Referencia en la base de datos actualizada correctamente")

        // Verificar que la actualización fue exitosa
        const stillInUse = await isFileInUse(file.publicUrl)
        if (stillInUse) {
          console.error("La referencia en la base de datos no se actualizó correctamente")
          throw new Error("No se pudo eliminar la referencia en la base de datos después de varios intentos")
        }
      }

      // Ahora eliminamos el archivo del storage usando la API directa
      console.log("Eliminando archivo del storage:", file.name)

      // Extraer la ruta correcta del archivo (sin el bucket)
      const filePath = file.name

      // Usar el método remove con la ruta correcta
      const { error: deleteError } = await supabase.storage.from("media").remove([filePath])

      if (deleteError) {
        console.error("Error al eliminar archivo del storage:", deleteError)
        throw new Error("Error al eliminar archivo del storage: " + deleteError.message)
      }

      console.log("Archivo eliminado correctamente del storage")

      // Mostrar notificación de éxito
      toast({
        title: "Archivo eliminado",
        description: `El archivo "${file.name}" ha sido eliminado correctamente.`,
      })

      // Actualizar la interfaz de usuario inmediatamente
      setFiles((prevFiles) => prevFiles.filter((f) => f.id !== file.id))
      setUnusedFiles((prevUnused) => prevUnused.filter((f) => f.id !== file.id))
      setFilteredFiles((prevFiltered) => prevFiltered.filter((f) => f.id !== file.id))

      // Actualizar estadísticas
      setStats((prevStats) => ({
        ...prevStats,
        size: prevStats.size - (file.metadata?.size || 0),
        count: prevStats.count - 1,
        usage: ((prevStats.size - (file.metadata?.size || 0)) / prevStats.limit) * 100,
      }))

      setFileToDelete(null)

      // Recargar la lista de archivos después de un breve retraso
      setTimeout(() => {
        loadFiles()
      }, 5000) // Aumentamos el tiempo de espera para asegurar que los cambios se propaguen
    } catch (err) {
      console.error("Error al eliminar archivo:", err)
      setError(err instanceof Error ? err.message : "Error al eliminar archivo")

      toast({
        title: "Error al eliminar",
        description: err instanceof Error ? err.message : "Error al eliminar archivo",
        variant: "destructive",
      })
    } finally {
      setDeleteLoading(false)
    }
  }

  // Forzar la eliminación de un archivo (sin verificar si está en uso)
  const forceDeleteFile = async (file: StorageFile) => {
    try {
      setDeleteLoading(true)
      setError(null)

      console.log("Forzando eliminación del archivo:", file.name)

      // Primero intentamos actualizar todas las referencias en la base de datos
      const { error: dbUpdateError } = await supabase
        .from("linkedin_posts")
        .update({ thumbnail_url: null })
        .eq("thumbnail_url", file.publicUrl)

      if (dbUpdateError) {
        console.error("Error al actualizar registros en la base de datos:", dbUpdateError)
        // Continuamos con la eliminación aunque haya error en la actualización
      }

      // Esperar un momento para que la actualización se propague
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Eliminar el archivo del storage
      const { error: deleteError } = await supabase.storage.from("media").remove([file.name])

      if (deleteError) {
        console.error("Error al eliminar archivo del storage:", deleteError)
        throw new Error("Error al eliminar archivo del storage: " + deleteError.message)
      }

      console.log("Archivo eliminado correctamente del storage")

      toast({
        title: "Archivo eliminado forzosamente",
        description: `El archivo "${file.name}" ha sido eliminado correctamente.`,
      })

      // Actualizar la interfaz de usuario inmediatamente
      setFiles((prevFiles) => prevFiles.filter((f) => f.id !== file.id))
      setUnusedFiles((prevUnused) => prevUnused.filter((f) => f.id !== file.id))
      setFilteredFiles((prevFiltered) => prevFiltered.filter((f) => f.id !== file.id))

      setFileToDelete(null)

      // Recargar la lista de archivos después de un breve retraso
      setTimeout(() => {
        loadFiles()
      }, 5000)
    } catch (err) {
      console.error("Error al forzar eliminación:", err)
      setError(err instanceof Error ? err.message : "Error al forzar eliminación")

      toast({
        title: "Error al eliminar",
        description: err instanceof Error ? err.message : "Error al forzar eliminación",
        variant: "destructive",
      })
    } finally {
      setDeleteLoading(false)
    }
  }

  // Eliminar todos los archivos no utilizados
  const deleteAllUnused = async () => {
    try {
      setDeleteLoading(true)
      setError(null)

      const filesToDelete = unusedFiles.map((file) => file.name)

      if (filesToDelete.length === 0) return

      console.log("Intentando eliminar archivos no utilizados:", filesToDelete)

      // Eliminar los archivos uno por uno para mayor fiabilidad
      let successCount = 0
      let errorCount = 0

      for (const fileName of filesToDelete) {
        try {
          const { error } = await supabase.storage.from("media").remove([fileName])

          if (error) {
            console.error(`Error al eliminar archivo ${fileName}:`, error)
            errorCount++
          } else {
            successCount++
          }
        } catch (err) {
          console.error(`Error al eliminar archivo ${fileName}:`, err)
          errorCount++
        }

        // Pequeña pausa entre eliminaciones para no sobrecargar la API
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      // Mostrar notificación de éxito/error
      if (successCount > 0) {
        toast({
          title: "Archivos eliminados",
          description: `Se han eliminado ${successCount} archivos no utilizados${errorCount > 0 ? ` (${errorCount} errores)` : ""}.`,
        })
      } else if (errorCount > 0) {
        toast({
          title: "Error al eliminar archivos",
          description: `No se pudo eliminar ningún archivo. Ocurrieron ${errorCount} errores.`,
          variant: "destructive",
        })
      }

      // Actualizar la interfaz de usuario
      if (successCount > 0) {
        // Actualizar la lista de archivos
        const deletedIds = new Set(unusedFiles.map((file) => file.id))
        setFiles((prevFiles) => prevFiles.filter((file) => !deletedIds.has(file.id)))
        setFilteredFiles((prevFiltered) => prevFiltered.filter((file) => !deletedIds.has(file.id)))
        setUnusedFiles([])

        // Actualizar estadísticas
        const deletedSize = unusedFiles.reduce((sum, file) => sum + (file.metadata?.size || 0), 0)
        setStats((prevStats) => ({
          ...prevStats,
          size: prevStats.size - deletedSize,
          count: prevStats.count - unusedFiles.length,
          usage: ((prevStats.size - deletedSize) / prevStats.limit) * 100,
        }))
      }

      // Recargar la lista de archivos para asegurarnos de que está actualizada
      setTimeout(() => {
        loadFiles()
      }, 5000)
    } catch (err) {
      console.error("Error al eliminar archivos no utilizados:", err)
      setError(err instanceof Error ? err.message : "Error al eliminar archivos no utilizados")

      toast({
        title: "Error al eliminar",
        description: err instanceof Error ? err.message : "Error al eliminar archivos no utilizados",
        variant: "destructive",
      })
    } finally {
      setDeleteLoading(false)
    }
  }

  // Verificar si un archivo es una imagen
  const isImageFile = (file: StorageFile) => {
    const mimeType = file.metadata?.mimetype || ""
    return mimeType.startsWith("image/")
  }

  // Obtener el tipo de archivo para mostrar el icono adecuado
  const getFileTypeIcon = (file: StorageFile) => {
    const mimeType = file.metadata?.mimetype || ""

    if (mimeType.startsWith("image/")) {
      return <ImageIcon className="h-6 w-6 text-blue-400" />
    } else if (mimeType.startsWith("video/")) {
      return <FileIcon className="h-6 w-6 text-purple-400" />
    } else if (mimeType.startsWith("audio/")) {
      return <FileIcon className="h-6 w-6 text-green-400" />
    } else if (mimeType.startsWith("application/pdf")) {
      return <FileIcon className="h-6 w-6 text-red-400" />
    } else {
      return <FileIcon className="h-6 w-6 text-gray-400" />
    }
  }

  useEffect(() => {
    loadFiles()
  }, [])

  const displayFiles = activeTab === "unused" ? unusedFiles : filteredFiles

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Gestor de Almacenamiento</CardTitle>
        <CardDescription>Administra tus imágenes almacenadas en Supabase Storage</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Estadísticas de almacenamiento */}
        <div className="mb-6 p-4 bg-zinc-900/50 rounded-lg">
          <h3 className="text-lg font-medium mb-2 text-white">Estadísticas de Almacenamiento</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-400">Espacio utilizado</p>
              <p className="text-xl font-semibold text-white">{formatFileSize(stats.size)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Archivos</p>
              <p className="text-xl font-semibold text-white">{stats.count}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Uso del plan gratuito</p>
              <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                <div
                  className={`h-2.5 rounded-full ${stats.usage > 90 ? "bg-red-500" : "bg-blue-500"}`}
                  style={{ width: `${Math.min(stats.usage, 100)}%` }}
                ></div>
              </div>
              <p className="text-sm mt-1 text-gray-400">
                {formatFileSize(stats.size)} de {formatFileSize(stats.limit)} ({stats.usage.toFixed(1)}%)
              </p>
            </div>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Buscar archivos..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Pestañas para filtrar archivos */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">Todos los archivos</TabsTrigger>
              <TabsTrigger value="unused" className="relative">
                No utilizados
                {unusedFiles.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unusedFiles.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={loadFiles} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Actualizar
              </Button>
              {activeTab === "unused" && unusedFiles.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setFileToDelete({ name: "all_unused" } as StorageFile)}
                  disabled={deleteLoading}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar todos ({unusedFiles.length})
                </Button>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-md flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          <TabsContent value="all" className="m-0">
            <FileGrid
              files={filteredFiles}
              loading={loading}
              onDelete={(file) => setFileToDelete(file)}
              onForceDelete={(file) => {
                if (
                  confirm(
                    `¿Estás seguro de que deseas forzar la eliminación de "${file.name}"? Esta acción es irreversible.`,
                  )
                ) {
                  forceDeleteFile(file)
                }
              }}
              onPreview={(file) => setPreviewFile(file)}
              isImageFile={isImageFile}
              getFileTypeIcon={getFileTypeIcon}
              emptyMessage={
                searchTerm ? "No se encontraron archivos que coincidan con la búsqueda" : "No hay archivos almacenados"
              }
            />
          </TabsContent>

          <TabsContent value="unused" className="m-0">
            <FileGrid
              files={unusedFiles}
              loading={loading}
              onDelete={(file) => setFileToDelete(file)}
              onForceDelete={(file) => {
                if (
                  confirm(
                    `¿Estás seguro de que deseas forzar la eliminación de "${file.name}"? Esta acción es irreversible.`,
                  )
                ) {
                  forceDeleteFile(file)
                }
              }}
              onPreview={(file) => setPreviewFile(file)}
              isImageFile={isImageFile}
              getFileTypeIcon={getFileTypeIcon}
              emptyMessage="No hay archivos sin utilizar"
            />
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Diálogo de confirmación para eliminar */}
      {fileToDelete && (
        <ConfirmDialog
          isOpen={!!fileToDelete}
          onClose={() => setFileToDelete(null)}
          onConfirm={() => {
            if (fileToDelete.name === "all_unused") {
              deleteAllUnused()
            } else {
              deleteFile(fileToDelete)
            }
          }}
          title={fileToDelete.name === "all_unused" ? "Eliminar todos los archivos no utilizados" : "Eliminar archivo"}
          description={
            fileToDelete.name === "all_unused"
              ? `¿Estás seguro de que deseas eliminar todos los archivos no utilizados (${unusedFiles.length})? Esta acción no se puede deshacer.`
              : `¿Estás seguro de que deseas eliminar el archivo "${fileToDelete.name}"? Esta acción no se puede deshacer.`
          }
          confirmText="Eliminar"
          cancelText="Cancelar"
        />
      )}

      {/* Diálogo de vista previa de imagen */}
      {previewFile && (
        <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>{previewFile.name}</DialogTitle>
            </DialogHeader>
            <div className="mt-4 flex flex-col items-center">
              {isImageFile(previewFile) ? (
                <div className="relative w-full max-h-[70vh] overflow-auto">
                  <img
                    src={previewFile.publicUrl || "/placeholder.svg"}
                    alt={previewFile.name}
                    className="max-w-full h-auto mx-auto"
                    onError={(e) => {
                      e.currentTarget.src = "/generic-placeholder-image.png"
                    }}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8">
                  {getFileTypeIcon(previewFile)}
                  <p className="mt-4 text-gray-400">
                    Este tipo de archivo ({previewFile.metadata?.mimetype || "desconocido"}) no se puede previsualizar.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => window.open(previewFile.publicUrl, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Abrir archivo
                  </Button>
                </div>
              )}
              <div className="mt-4 w-full flex justify-between items-center text-sm text-gray-400">
                <span>Tamaño: {formatFileSize(previewFile.metadata?.size || 0)}</span>
                <span>Tipo: {previewFile.metadata?.mimetype || "Desconocido"}</span>
                <span>Creado: {new Date(previewFile.created_at).toLocaleString()}</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  )
}

// Componente para mostrar la cuadrícula de archivos
function FileGrid({
  files,
  loading,
  onDelete,
  onForceDelete,
  onPreview,
  isImageFile,
  getFileTypeIcon,
  emptyMessage,
}: {
  files: StorageFile[]
  loading: boolean
  onDelete: (file: StorageFile) => void
  onForceDelete: (file: StorageFile) => void
  onPreview: (file: StorageFile) => void
  isImageFile: (file: StorageFile) => boolean
  getFileTypeIcon: (file: StorageFile) => React.ReactNode
  emptyMessage: string
}) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
      </div>
    )
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {files.map((file) => (
        <div
          key={file.id}
          className="bg-zinc-900/80 backdrop-blur-md rounded-lg border border-zinc-800 overflow-hidden group"
        >
          <div className="aspect-square w-full overflow-hidden relative cursor-pointer" onClick={() => onPreview(file)}>
            {isImageFile(file) ? (
              <img
                src={file.publicUrl || "/placeholder.svg"}
                alt={file.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/generic-placeholder-image.png"
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-800 p-4">
                {getFileTypeIcon(file)}
                <p className="text-gray-400 text-sm mt-2 text-center break-all">
                  {file.metadata?.mimetype || "Archivo desconocido"}
                </p>
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation()
                  onPreview(file)
                }}
              >
                <Eye className="h-4 w-4" />
                <span className="sr-only">Ver</span>
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(file.publicUrl, "_blank")
                }}
              >
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">Abrir</span>
              </Button>
              <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(file)
                }}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Eliminar</span>
              </Button>
            </div>
          </div>
          <div className="p-3">
            <p className="text-sm font-medium text-gray-200 truncate" title={file.name}>
              {file.name}
            </p>
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-400">{formatFileSize(file.metadata?.size || 0)}</p>
              <div className="flex items-center gap-1">
                <p className="text-xs text-gray-400">{new Date(file.created_at).toLocaleDateString()}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-red-500 hover:text-red-400"
                  title="Forzar eliminación"
                  onClick={() => onForceDelete(file)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
