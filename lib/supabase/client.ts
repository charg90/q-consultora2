import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { type Database } from '@/lib/database.types'

// Crear una instancia del cliente de Supabase para componentes del lado del cliente
export const createClient = () => {
  return createClientComponentClient<Database>()
}
