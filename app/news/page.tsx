import { ExternalLink, Play, Linkedin, Newspaper } from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"

import { AuthorDisplay } from "../Components/user/author-display"

export default async function News() {
  const supabase = createClient()

  // Obtener los videos de YouTube de la base de datos
  const { data: youtubeVideos } = await supabase
    .from("youtube_videos")
    .select("*")
    .order("created_at", { ascending: false })

  // Obtener las publicaciones de LinkedIn de la base de datos
  const { data: linkedinPosts } = await supabase
    .from("linkedin_posts")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-black via-zinc-900 to-black overflow-hidden">
      {/* ... (código anterior del fondo y decoraciones permanece igual) ... */}

      {/* Contenido principal */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 text-white">
        {/* ... (código anterior del encabezado permanece igual) ... */}

        {/* Videos Section - Esta es la parte modificada */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-6 flex items-center text-gray-200">
            <Play className="w-6 h-6 mr-2 text-gray-400" />
            <span>Videos Destacados</span>
          </h3>
          {youtubeVideos && youtubeVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {youtubeVideos.map((video) => (
                <a
                  key={video.id}
                  href={`https://www.youtube.com/watch?v=${video.youtube_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px] border border-zinc-800"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-end">
                    <div className="p-4 w-full">
                      <span className="text-white font-medium">{video.title}</span>
                      {video.description && (
                        <p className="text-gray-300 text-sm mt-1 line-clamp-2">{video.description}</p>
                      )}
                      <div className="mt-2">
                        <AuthorDisplay userId={video.user_id || ""} createdAt={video.created_at} size="sm" />
                      </div>
                    </div>
                  </div>
                  <div className="aspect-video w-full overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.youtube_id}?start=${video.start_time || 0}`}
                      title={`YouTube ${video.title}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full rounded-lg pointer-events-none" // Added pointer-events-none
                    ></iframe>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              <p>No hay videos disponibles actualmente.</p>
            </div>
          )}
        </div>

        {/* LinkedIn Section */}
        <div>
          <h3 className="text-2xl font-bold mb-6 flex items-center text-gray-200">
          <Newspaper className="w-6 h-6 mr-2 text-gray-400" />
            <span>Informes y Noticias</span>
          </h3>
          {linkedinPosts && linkedinPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {linkedinPosts.map((post) => (
                <a
                  key={post.id}
                  href={post.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col p-5 bg-zinc-900/80 backdrop-blur-md rounded-xl shadow-md border border-zinc-800 hover:bg-zinc-800/80 hover:border-zinc-700 transition-all duration-300 hover:translate-y-[-5px]"
                >
                  {post.thumbnail_url && (
                    <div className="w-full h-32 mb-4 overflow-hidden rounded-lg">
                      <img
                        src={post.thumbnail_url || "/placeholder.svg"}
                        alt={post.title || "Publicación de LinkedIn"}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                   
                      />
                    </div>
                  )}
                  <div className="flex items-center mb-3">
                  
                    <span className="font-semibold text-gray-200">{post.title || `Publicación #${post.id}`}</span>
                  </div>
                  {post.description && <p className="text-gray-400 mb-3 text-sm line-clamp-3">{post.description}</p>}
                  <div className="mt-2 mb-3">
                    <AuthorDisplay userId={post.user_id || ""} createdAt={post.created_at} size="sm" />
                  </div>
                  <div className="mt-auto flex items-center text-gray-300 font-medium group-hover:underline">
                    <span>Ver publicación</span>
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              <p>No hay publicaciones disponibles actualmente.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
