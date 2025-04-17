"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, HardDrive, ImageIcon } from "lucide-react"
import { formatFileSize } from "@/utils/image-compression"
import { useRouter } from "next/navigation"

export function StorageStats() {
  const [stats, setStats] = useState({
    size: 0,
    count: 0,
    usage: 0,
    limit: 1024 * 1024 * 1024, // 1GB límite gratuito
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true)

        // Obtener lista de archivos
        const { data: fileList, error: fileError } = await supabase.storage.from("media").list()

        if (fileError) {
          throw new Error(fileError.message)
        }

        // Calcular estadísticas
        const totalSize = fileList?.reduce((sum, file) => sum + (file.metadata?.size || 0), 0) || 0
        setStats({
          size: totalSize,
          count: fileList?.length || 0,
          usage: (totalSize / stats.limit) * 100,
          limit: stats.limit,
        })
      } catch (err) {
        console.error("Error al cargar estadísticas:", err)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <HardDrive className="mr-2 h-5 w-5 text-gray-400" />
          Almacenamiento
        </CardTitle>
        <CardDescription>Gestiona tu espacio de almacenamiento</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ImageIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-300">Archivos</span>
              </div>
              <span className="font-medium">{stats.count}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Database className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-300">Espacio utilizado</span>
              </div>
              <span className="font-medium">{formatFileSize(stats.size)}</span>
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Uso del plan gratuito</span>
                <span>{stats.usage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${stats.usage > 90 ? "bg-red-500" : "bg-blue-500"}`}
                  style={{ width: `${Math.min(stats.usage, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs mt-1 text-gray-400">
                {formatFileSize(stats.size)} de {formatFileSize(stats.limit)}
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard/storage")}>
          Gestionar almacenamiento
        </Button>
      </CardFooter>
    </Card>
  )
}
