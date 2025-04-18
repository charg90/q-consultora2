"use client"

import { getUserRoles, hasRole, Role } from "@/lib/roles"
import { useState, useEffect } from "react"


export function useHasRole(roleName: string) {
  const [loading, setLoading] = useState(true)
  const [hasUserRole, setHasUserRole] = useState(false)

  useEffect(() => {
    async function checkRole() {
      setLoading(true)
      const result = await hasRole(roleName)
      setHasUserRole(result)
      setLoading(false)
    }

    checkRole()
  }, [roleName])

  return { hasRole: hasUserRole, loading }
}

export function useUserRoles() {
  const [loading, setLoading] = useState(true)
  const [roles, setRoles] = useState<Role[]>([])

  useEffect(() => {
    async function fetchRoles() {
      setLoading(true)
      const userRoles = await getUserRoles()
      setRoles(userRoles)
      setLoading(false)
    }

    fetchRoles()
  }, [])

  return { roles, loading }
}
