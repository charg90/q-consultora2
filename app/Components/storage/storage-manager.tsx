"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash2, RefreshCw, ExternalLink, AlertCircle } from "lucide-react"
import { formatFileSize } from "@/utils/image-compression"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

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

  const supabase = createClient()

  // Cargar archivos y estadísticas
  const loadFiles = async () => {
    try {
      setLoading(true)
      setError(null)

      // Obtener lista de archivos
      const { data: fileList, error: fileError } = await supabase.storage.from("media").list()

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

  // Eliminar un archivo
  const deleteFile = async (file: StorageFile) => {
    try {
      setDeleteLoading(true)
      const { error: deleteError } = await supabase.storage.from("media").remove([file.name])

      if (deleteError) throw new Error(deleteError.message)

      // Actualizar la lista de archivos
      setFiles(files.filter((f) => f.id !== file.id))
      setUnusedFiles(unusedFiles.filter((f) => f.id !== file.id))

      // Actualizar estadísticas
      setStats({
        ...stats,
        size: stats.size - (file.metadata?.size || 0),
        count: stats.count - 1,
        usage: ((stats.size - (file.metadata?.size || 0)) / stats.limit) * 100,
      })

      setFileToDelete(null)
    } catch (err) {
      console.error("Error al eliminar archivo:", err)
      setError(err instanceof Error ? err.message : "Error al eliminar archivo")
    } finally {
      setDeleteLoading(false)
    }
  }

  // Eliminar todos los archivos no utilizados
  const deleteAllUnused = async () => {
    try {
      setDeleteLoading(true)
      const filesToDelete = unusedFiles.map((file) => file.name)

      if (filesToDelete.length === 0) return

      const { error: deleteError } = await supabase.storage.from("media").remove(filesToDelete)

      if (deleteError) throw new Error(deleteError.message)

      // Actualizar la lista de archivos
      const deletedIds = new Set(unusedFiles.map((file) => file.id))
      setFiles(files.filter((file) => !deletedIds.has(file.id)))
      setUnusedFiles([])

      // Actualizar estadísticas
      const deletedSize = unusedFiles.reduce((sum, file) => sum + (file.metadata?.size || 0), 0)
      setStats({
        ...stats,
        size: stats.size - deletedSize,
        count: stats.count - unusedFiles.length,
        usage: ((stats.size - deletedSize) / stats.limit) * 100,
      })
    } catch (err) {
      console.error("Error al eliminar archivos no utilizados:", err)
      setError(err instanceof Error ? err.message : "Error al eliminar archivos no utilizados")
    } finally {
      setDeleteLoading(false)
    }
  }

  useEffect(() => {
    loadFiles()
  }, [])

  const displayFiles = activeTab === "unused" ? unusedFiles : files

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
              files={files}
              loading={loading}
              onDelete={(file) => setFileToDelete(file)}
              emptyMessage="No hay archivos almacenados"
            />
          </TabsContent>

          <TabsContent value="unused" className="m-0">
            <FileGrid
              files={unusedFiles}
              loading={loading}
              onDelete={(file) => setFileToDelete(file)}
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
    </Card>
  )
}

// Componente para mostrar la cuadrícula de archivos
function FileGrid({
  files,
  loading,
  onDelete,
  emptyMessage,
}: {
  files: StorageFile[]
  loading: boolean
  onDelete: (file: StorageFile) => void
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
          <div className="aspect-square w-full overflow-hidden relative">
            {file.metadata?.mimetype?.startsWith("image/") ? (
              <img
                src={file.publicUrl || "/placeholder.svg"}
                alt={file.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/generic-placeholder-image.png"
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                <p className="text-gray-400 text-sm">{file.metadata?.mimetype || "Archivo desconocido"}</p>
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8"
                onClick={() => window.open(file.publicUrl, "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">Ver</span>
              </Button>
              <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => onDelete(file)}>
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
              <p className="text-xs text-gray-400">{new Date(file.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
