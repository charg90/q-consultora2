import { ExternalLink, Play, Linkedin } from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import BackgroundImage from "../../public/backgound-wall-street.jpeg"

export default async function News() {
  const supabase = createClient()

  // Obtener los videos de YouTube de la base de datos
  const { data: youtubeVideos } = await supabase
    .from("youtube_videos")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(4)

  // Obtener las publicaciones de LinkedIn de la base de datos
  const { data: linkedinPosts } = await supabase
    .from("linkedin_posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6)

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-black via-zinc-900 to-black overflow-hidden">
      {/* Imagen de fondo como textura */}
      <div className="absolute inset-0 z-0 opacity-10 mix-blend-overlay">
        <Image
          src={BackgroundImage || "/placeholder.svg"}
          alt="Wall Street Background"
          fill
          className="object-cover grayscale"
          priority
          quality={85}
        />
      </div>

      {/* Overlay de gradiente para mejorar legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-zinc-900/50 z-0"></div>

      {/* Elementos decorativos sutiles */}
      <div className="absolute inset-0 overflow-hidden opacity-5 z-0">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
        <div className="absolute top-0 -right-40 w-80 h-80 bg-zinc-400 rounded-full mix-blend-overlay filter blur-3xl"></div>
        <div className="absolute bottom-0 left-20 w-80 h-80 bg-zinc-300 rounded-full mix-blend-overlay filter blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-zinc-500 rounded-full mix-blend-overlay filter blur-3xl"></div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 text-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent">
            Nuestra Presencia en Medios
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-gray-500 to-gray-300 mx-auto rounded-full"></div>
        </div>

        {/* Videos Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-6 flex items-center text-gray-200">
            <Play className="w-6 h-6 mr-2 text-gray-400" />
            <span>Videos Destacados</span>
          </h3>
          {youtubeVideos && youtubeVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {youtubeVideos.map((video) => (
                <div
                  key={video.id}
                  className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px] border border-zinc-800"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-end">
                    <div className="p-4 w-full">
                      <span className="text-white font-medium">{video.title}</span>
                      {video.description && (
                        <p className="text-gray-300 text-sm mt-1 line-clamp-2">{video.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="aspect-video w-full overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.youtube_id}?start=${video.start_time || 0}`}
                      title={`YouTube ${video.title}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full rounded-lg"
                    ></iframe>
                  </div>
                </div>
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
            <Linkedin className="w-6 h-6 mr-2 text-gray-400" />
            <span>Informes</span>
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
                        onError={(e) => {
                          e.currentTarget.src = "/generic-placeholder-image.png"
                        }}
                      />
                    </div>
                  )}
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mr-3">
                      <Linkedin className="w-5 h-5 text-gray-300" />
                    </div>
                    <span className="font-semibold text-gray-200">{post.title || `Publicación #${post.id}`}</span>
                  </div>
                  {post.description && <p className="text-gray-400 mb-3 text-sm line-clamp-3">{post.description}</p>}
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
