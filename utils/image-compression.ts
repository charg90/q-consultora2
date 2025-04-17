/**
 * Comprime una imagen antes de subirla a Supabase Storage
 * @param file Archivo de imagen a comprimir
 * @param maxSizeMB Tamaño máximo en MB (por defecto 1MB)
 * @param maxWidthOrHeight Ancho o alto máximo en píxeles (por defecto 1920px)
 * @returns Archivo comprimido como Blob con tipo de archivo
 */
export async function compressImage(file: File, maxSizeMB = 1, maxWidthOrHeight = 1920): Promise<File> {
    // Si no es una imagen, devolver el archivo original
    if (!file.type.startsWith("image/")) {
      return file
    }
  
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target?.result as string
  
        img.onload = () => {
          const canvas = document.createElement("canvas")
          let width = img.width
          let height = img.height
  
          // Redimensionar si es necesario
          if (width > maxWidthOrHeight || height > maxWidthOrHeight) {
            if (width > height) {
              height = Math.round((height * maxWidthOrHeight) / width)
              width = maxWidthOrHeight
            } else {
              width = Math.round((width * maxWidthOrHeight) / height)
              height = maxWidthOrHeight
            }
          }
  
          canvas.width = width
          canvas.height = height
  
          const ctx = canvas.getContext("2d")
          if (!ctx) {
            reject(new Error("No se pudo obtener el contexto del canvas"))
            return
          }
  
          ctx.drawImage(img, 0, 0, width, height)
  
          // Determinar el tipo y calidad
          let quality = 0.8 // 80% de calidad por defecto
          let type = file.type
  
          // Ajustar calidad según el tamaño del archivo
          if (file.size > maxSizeMB * 1024 * 1024 * 2) {
            quality = 0.6 // Más compresión para archivos muy grandes
          }
  
          // Convertir a WebP si el navegador lo soporta y no es ya WebP
          if (canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0 && !type.includes("webp")) {
            type = "image/webp"
          }
  
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Error al comprimir la imagen"))
                return
              }
  
              // Crear un nuevo archivo con el mismo nombre pero comprimido
              const fileName = file.name.replace(/\.[^/.]+$/, "")
              const fileExt = type.split("/")[1]
              const newFile = new File([blob], `${fileName}.${fileExt}`, {
                type: type,
                lastModified: Date.now(),
              })
  
              resolve(newFile)
            },
            type,
            quality,
          )
        }
  
        img.onerror = () => {
          reject(new Error("Error al cargar la imagen"))
        }
      }
  
      reader.onerror = () => {
        reject(new Error("Error al leer el archivo"))
      }
    })
  }
  
  /**
   * Formatea el tamaño de un archivo en KB o MB
   * @param bytes Tamaño en bytes
   * @returns Tamaño formateado con unidad
   */
  export function formatFileSize(bytes: number): string {
    if (bytes < 1024) {
      return bytes + " B"
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + " KB"
    } else {
      return (bytes / (1024 * 1024)).toFixed(2) + " MB"
    }
  }
  