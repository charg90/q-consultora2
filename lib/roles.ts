import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/database.types"

export type Role = Database["public"]["Tables"]["roles"]["Row"]
export type UserRole = Database["public"]["Tables"]["user_roles"]["Row"]

/**
 * Verifica si el usuario actual tiene un rol específico
 */
export async function hasRole(roleName: string): Promise<boolean> {
  try {
    const supabase = createClient()

    // First get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return false

    // Step 1: Get the role ID for the given role name
    const { data: role, error: roleError } = await supabase.from("roles").select("id").eq("name", roleName).single()

    if (roleError || !role) {
      console.error("Error finding role:", roleError)
      return false
    }

    // Step 2: Check if the user has this role as their default role
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("default_role_id")
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error("Error finding user profile:", profileError)
      return false
    }

    // Step 3: Return true if the user has the role
    return profile?.default_role_id === role.id
  } catch (error) {
    console.error("Error verificando rol:", error)
    return false
  }
}


/**
 * Obtiene todos los roles del usuario actual
 */
export async function getUserRoles(): Promise<Role[]> {
  const supabase = createClient()

  const { data, error } = await supabase.rpc("get_user_roles")

  if (error) {
    console.error("Error obteniendo roles:", error)
    return []
  }

  return data || []
}

/**
 * Obtiene todos los roles del usuario especificado (solo para administradores)
 */
export async function getUserRolesById(userId: string): Promise<Role[]> {
  const supabase = createClient()

  const { data, error } = await supabase.rpc("get_user_roles", { user_id: userId })

  if (error) {
    console.error("Error obteniendo roles:", error)
    return []
  }

  return data || []
}

/**
 * Asigna un rol a un usuario (solo para administradores)
 */
export async function assignRole(userId: string, roleId: number): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase.from("user_roles").insert({ user_id: userId, role_id: roleId })

  if (error) {
    console.error("Error asignando rol:", error)
    return false
  }

  return true
}

/**
 * Elimina un rol de un usuario (solo para administradores)
 */
export async function removeRole(userId: string, roleId: number): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase.from("user_roles").delete().match({ user_id: userId, role_id: roleId })

  if (error) {
    console.error("Error eliminando rol:", error)
    return false
  }

  return true
}

/**
 * Obtiene todos los roles disponibles en el sistema
 */
export async function getAllRoles(): Promise<Role[]> {
  const supabase = createClient()

  const { data, error } = await supabase.from("roles").select("*")

  if (error) {
    console.error("Error obteniendo roles:", error)
    return []
  }

  return data || []
}

/**
 * Establece el rol predeterminado de un usuario
 */
export async function setDefaultRole(userId: string, roleId: number): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase.from("profiles").update({ default_role_id: roleId }).eq("id", userId)

  if (error) {
    console.error("Error estableciendo rol predeterminado:", error)
    return false
  }

  return true
}
