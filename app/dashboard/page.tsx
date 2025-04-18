"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Edit, Trash2, ExternalLink, ShieldCheck } from "lucide-react"
import type { Database } from "@/lib/database.types"
import { YouTubeForm } from "../Components/media/youtube-form"
import { LinkedInForm } from "../Components/media/linkedin-form"
import { StorageStats } from "../Components/dashboard/storage-stats"
import { YouTubeEditForm } from "../Components/media/youtube-edit-form"
import { LinkedInEditForm } from "../Components/media/linkedin-edit-form"
import { AuthorDisplay } from "../Components/user/author-display"
import { DashboardHeader } from "../Components/dashboard/header"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useHasRole } from "../hooks/use-roles"

type YouTubeVideo = Database["public"]["Tables"]["youtube_videos"]["Row"]
type LinkedInPost = Database["public"]["Tables"]["linkedin_posts"]["Row"]
type Profile = Database["public"]["Tables"]["profiles"]["Row"]

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [linkedinPosts, setLinkedinPosts] = useState<LinkedInPost[]>([])
  const [allVideos, setAllVideos] = useState<YouTubeVideo[]>([])
  const [allPosts, setAllPosts] = useState<LinkedInPost[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("my-content")
  const { hasRole: isAdmin, loading: checkingAdmin } = useHasRole("admin")

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

      // Verificar si el usuario es administrador

      // Si es administrador, cargar todos los videos y publicaciones
      if (isAdmin) {
        // Cargar todos los videos
        const { data: allVideosData } = await supabase
          .from("youtube_videos")
          .select("*")
          .order("created_at", { ascending: false })

        setAllVideos(allVideosData || [])

        // También cargar los videos del usuario para la vista "Mis videos"
        const { data: userVideosData } = await supabase
          .from("youtube_videos")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })

        setVideos(userVideosData || [])

        // Cargar todas las publicaciones
        const { data: allPostsData } = await supabase
          .from("linkedin_posts")
          .select("*")
          .order("created_at", { ascending: false })

        setAllPosts(allPostsData || [])

        // También cargar las publicaciones del usuario para la vista "Mis publicaciones"
        const { data: userPostsData } = await supabase
          .from("linkedin_posts")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })

        setLinkedinPosts(userPostsData || [])
      } else {
        // Si no es administrador, solo cargar los videos y publicaciones del usuario
        const { data: videosData } = await supabase
          .from("youtube_videos")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })

        setVideos(videosData || [])

        const { data: postsData } = await supabase
          .from("linkedin_posts")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })

        setLinkedinPosts(postsData || [])
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }, [supabase, router, isAdmin])

  // Función para recargar solo las publicaciones de LinkedIn
  const reloadLinkedInPosts = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) return

      // Verificar si el usuario es administrador

      if (isAdmin) {
        // Si es administrador, cargar todas las publicaciones
        const { data: allPostsData } = await supabase
          .from("linkedin_posts")
          .select("*")
          .order("created_at", { ascending: false })

        setAllPosts(allPostsData || [])

        // También cargar las publicaciones del usuario
        const { data: userPostsData } = await supabase
          .from("linkedin_posts")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })

        setLinkedinPosts(userPostsData || [])
      } else {
        // Si no es administrador, solo cargar las publicaciones del usuario
        const { data: postsData } = await supabase
          .from("linkedin_posts")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })

        setLinkedinPosts(postsData || [])
      }
    } catch (error) {
      console.error("Error reloading LinkedIn posts:", error)
    }
  }, [supabase, isAdmin])

  // Función para recargar solo los videos de YouTube
  const reloadYouTubeVideos = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) return

      // Verificar si el usuario es administrador

      if (isAdmin) {
        // Si es administrador, cargar todos los videos
        const { data: allVideosData } = await supabase
          .from("youtube_videos")
          .select("*")
          .order("created_at", { ascending: false })

        setAllVideos(allVideosData || [])

        // También cargar los videos del usuario
        const { data: userVideosData } = await supabase
          .from("youtube_videos")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })

        setVideos(userVideosData || [])
      } else {
        // Si no es administrador, solo cargar los videos del usuario
        const { data: videosData } = await supabase
          .from("youtube_videos")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })

        setVideos(videosData || [])
      }
    } catch (error) {
      console.error("Error reloading YouTube videos:", error)
    }
  }, [supabase, isAdmin])

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
      if (isAdmin) {
        setAllVideos(allVideos.filter((video) => video.id !== videoId))
      }
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
      if (isAdmin) {
        setAllPosts(allPosts.filter((post) => post.id !== postId))
      }
      setDeletingPost(null)
    } catch (error) {
      console.error("Error:", error)
    }
  }

  if (loading || checkingAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-zinc-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-zinc-900 to-slate-900">
      <DashboardHeader />

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

        {isAdmin && (
          <div className="mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="my-content">Mi Contenido</TabsTrigger>
                <TabsTrigger value="all-content" className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Todo el Contenido</span>
                  <Badge variant="outline" className="ml-1 bg-green-900/30">
                    Admin
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}

        {/* Videos de YouTube */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            {activeTab === "all-content" && isAdmin ? "Todos los Videos de YouTube" : "Tus Videos de YouTube"}
          </h2>

          {activeTab === "all-content" && isAdmin ? (
            // Mostrar todos los videos (solo para administradores)
            allVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allVideos.map((video) => (
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
                      <div className="mb-4">
                        <AuthorDisplay userId={video.user_id || ""} createdAt={video.created_at} size="sm" />
                      </div>
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
              <p className="text-gray-400">No hay videos disponibles.</p>
            )
          ) : // Mostrar solo los videos del usuario
          videos.length > 0 ? (
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
                    <div className="mb-4">
                      <AuthorDisplay userId={video.user_id || ""} createdAt={video.created_at} size="sm" />
                    </div>
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

        {/* Publicaciones de LinkedIn */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            {activeTab === "all-content" && isAdmin
              ? "Todas las Publicaciones de LinkedIn"
              : "Tus Publicaciones de LinkedIn"}
          </h2>

          {activeTab === "all-content" && isAdmin ? (
            // Mostrar todas las publicaciones (solo para administradores)
            allPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allPosts.map((post) => (
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
                      <div className="mb-3">
                        <span className="font-semibold text-white">{post.title || "Publicación de LinkedIn"}</span>
                      </div>
                      {post.description && (
                        <p className="text-gray-400 mb-3 text-sm line-clamp-3">{post.description}</p>
                      )}
                      <div className="mb-4">
                        <AuthorDisplay userId={post.user_id || ""} createdAt={post.created_at} size="sm" />
                      </div>
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
              <p className="text-gray-400">No hay publicaciones disponibles.</p>
            )
          ) : // Mostrar solo las publicaciones del usuario
          linkedinPosts.length > 0 ? (
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
                    <div className="mb-3">
                      <span className="font-semibold text-white">{post.title || "Publicación de LinkedIn"}</span>
                    </div>
                    {post.description && <p className="text-gray-400 mb-3 text-sm line-clamp-3">{post.description}</p>}
                    <div className="mb-4">
                      <AuthorDisplay userId={post.user_id || ""} createdAt={post.created_at} size="sm" />
                    </div>
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
