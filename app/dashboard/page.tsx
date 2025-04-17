"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { LogOut, Edit, Trash2, ExternalLink } from "lucide-react"
import type { Database } from "@/lib/database.types"
import { YouTubeEditForm,  } from "../Components/media/youtube-edit-form"
import { LinkedInForm } from "../Components/media/linkedin-form"
import { StorageStats } from "../Components/dashboard/storage-stats"
import { LinkedInEditForm } from "../Components/media/linkedin-edit-form"
import { YouTubeForm } from "../Components/media/youtube-form"

type YouTubeVideo = Database["public"]["Tables"]["youtube_videos"]["Row"]
type LinkedInPost = Database["public"]["Tables"]["linkedin_posts"]["Row"]
type Profile = Database["public"]["Tables"]["profiles"]["Row"]

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [linkedinPosts, setLinkedinPosts] = useState<LinkedInPost[]>([])
  const [loading, setLoading] = useState(true)

  // Estados para edición y eliminación
  const [editingVideo, setEditingVideo] = useState<YouTubeVideo | null>(null)
  const [editingPost, setEditingPost] = useState<LinkedInPost | null>(null)
  const [deletingVideo, setDeletingVideo] = useState<YouTubeVideo | null>(null)
  const [deletingPost, setDeletingPost] = useState<LinkedInPost | null>(null)

  const router = useRouter()
  const supabase = createClient()

  // Función para cargar los datos
  const loadData = useCallback(async () => {
    try {
      // Verificar si el usuario está autenticado
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/auth")
        return
      }

      setUser(session.user)

      // Obtener el perfil del usuario
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

      setProfile(profileData)

      // Obtener los videos del usuario
      const { data: videosData } = await supabase
        .from("youtube_videos")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })

      setVideos(videosData || [])

      // Obtener las publicaciones de LinkedIn del usuario
      const { data: postsData } = await supabase
        .from("linkedin_posts")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })

      setLinkedinPosts(postsData || [])
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }, [supabase, router])

  // Función para recargar solo las publicaciones de LinkedIn
  const reloadLinkedInPosts = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) return

      const { data: postsData } = await supabase
        .from("linkedin_posts")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })

      setLinkedinPosts(postsData || [])
    } catch (error) {
      console.error("Error reloading LinkedIn posts:", error)
    }
  }, [supabase])

  // Función para recargar solo los videos de YouTube
  const reloadYouTubeVideos = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) return

      const { data: videosData } = await supabase
        .from("youtube_videos")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })

      setVideos(videosData || [])
    } catch (error) {
      console.error("Error reloading YouTube videos:", error)
    }
  }, [supabase])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleDeleteVideo = async (videoId: number) => {
    try {
      const { error } = await supabase.from("youtube_videos").delete().eq("id", videoId)

      if (error) {
        console.error("Error deleting video:", error)
        return
      }

      // Actualizar la lista de videos
      setVideos(videos.filter((video) => video.id !== videoId))
      setDeletingVideo(null)
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const handleDeletePost = async (postId: number) => {
    try {
      const { error } = await supabase.from("linkedin_posts").delete().eq("id", postId)

      if (error) {
        console.error("Error deleting post:", error)
        return
      }

      // Actualizar la lista de publicaciones
      setLinkedinPosts(linkedinPosts.filter((post) => post.id !== postId))
      setDeletingPost(null)
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/auth")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-zinc-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-zinc-900 to-slate-900">
      <header className="bg-black/50 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Panel de Control</h1>
          <Button variant="ghost" className="text-white" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div>
            <YouTubeForm onSuccess={reloadYouTubeVideos} />
          </div>
          <div>
            <LinkedInForm onSuccess={reloadLinkedInPosts} />
          </div>
          <div>
            <StorageStats />
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Tus Videos de YouTube</h2>
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="bg-zinc-900/80 backdrop-blur-md rounded-xl shadow-md border border-zinc-800 overflow-hidden"
                >
                  {video.thumbnail_url && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={video.thumbnail_url || "/placeholder.svg"}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">{video.title}</h3>
                    {video.description && (
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{video.description}</p>
                    )}
                    <div className="flex justify-between items-center">
                      <a
                        href={`https://www.youtube.com/watch?v=${video.youtube_id}${video.start_time ? `&t=${video.start_time}` : ""}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 text-sm font-medium hover:underline inline-flex items-center"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Ver en YouTube
                      </a>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-white"
                          onClick={() => setEditingVideo(video)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-red-500"
                          onClick={() => setDeletingVideo(video)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Eliminar</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No has agregado ningún video todavía.</p>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Tus Publicaciones de LinkedIn</h2>
          {linkedinPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {linkedinPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-zinc-900/80 backdrop-blur-md rounded-xl shadow-md border border-zinc-800 overflow-hidden"
                >
                  {post.thumbnail_url && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={post.thumbnail_url || "/placeholder.svg"}
                        alt={post.title || "Publicación de LinkedIn"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/generic-placeholder-image.png"
                        }}
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 rounded-full bg-[#0A66C2] flex items-center justify-center mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white"
                        >
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                          <rect width="4" height="12" x="2" y="9"></rect>
                          <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                      </div>
                      <span className="font-semibold text-white">{post.title || "Publicación de LinkedIn"}</span>
                    </div>
                    {post.description && <p className="text-gray-400 mb-3 text-sm line-clamp-3">{post.description}</p>}
                    <div className="flex justify-between items-center">
                      <a
                        href={post.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-cyan-400 font-medium hover:underline"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        <span>Ver publicación</span>
                      </a>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-white"
                          onClick={() => setEditingPost(post)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-red-500"
                          onClick={() => setDeletingPost(post)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Eliminar</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No has agregado ninguna publicación todavía.</p>
          )}
        </div>
      </main>

      {/* Modales de edición */}
      {editingVideo && (
        <YouTubeEditForm
          video={editingVideo}
          isOpen={!!editingVideo}
          onClose={() => setEditingVideo(null)}
          onSuccess={reloadYouTubeVideos}
        />
      )}

      {editingPost && (
        <LinkedInEditForm
          post={editingPost}
          isOpen={!!editingPost}
          onClose={() => setEditingPost(null)}
          onSuccess={reloadLinkedInPosts}
        />
      )}

      {/* Diálogos de confirmación para eliminar */}
      {deletingVideo && (
        <ConfirmDialog
          isOpen={!!deletingVideo}
          onClose={() => setDeletingVideo(null)}
          onConfirm={() => handleDeleteVideo(deletingVideo.id)}
          title="Eliminar video"
          description={`¿Estás seguro de que deseas eliminar el video "${deletingVideo.title}"? Esta acción no se puede deshacer.`}
        />
      )}

      {deletingPost && (
        <ConfirmDialog
          isOpen={!!deletingPost}
          onClose={() => setDeletingPost(null)}
          onConfirm={() => handleDeletePost(deletingPost.id)}
          title="Eliminar publicación"
          description={`¿Estás seguro de que deseas eliminar la publicación "${deletingPost.title || "sin título"}"? Esta acción no se puede deshacer.`}
        />
      )}
    </div>
  )
}
