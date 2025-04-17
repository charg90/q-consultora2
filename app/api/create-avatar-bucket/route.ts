import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Verificar si el usuario está autenticado y es administrador
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Crear el bucket de avatares si no existe
    const { error: bucketError } = await supabase.storage.createBucket("avatars", {
      public: true,
      fileSizeLimit: 2097152, // 2MB
      allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
    })

    if (bucketError && bucketError.message !== "Bucket already exists") {
      return NextResponse.json({ error: bucketError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Bucket de avatares creado o ya existente" })
  } catch (error) {
    console.error("Error al crear el bucket de avatares:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
