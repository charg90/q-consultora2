import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { type Database } from '@/lib/database.types'

// Crear una instancia del cliente de Supabase para componentes del lado del servidor
export const createClient = () => {
  return createServerComponentClient<Database>({ cookies })
}
