import { useCallback } from 'react'
import { GROUPS } from './perms/groups'
import { RESOURCES } from './perms/resources'
import { PERMS } from './perms'
import type { TreeGroup } from './perms/types'
import useProfileStore from './use-profile-store'

export default function usePerms() {
  const { profile } = useProfileStore()
  const { role, isSuperuser } = profile || {}

  const getPerm = useCallback(
    (value: string) => {
      return PERMS.find((perm) => perm.value === value)
    },
    [PERMS]
  )

  const canAccess = useCallback(
    (perm?: string) => {
      if (isSuperuser) return true // Superusuario: todo permitido
      if (!perm) return false // Si el componente no definió permiso → no accede

      const perms = role?.perms || []
      if (perms.length === 0) return false // Sin permisos asignados → no accede

      return perms.includes(perm) // Verifica si el permiso requerido está en la lista
    },
    [isSuperuser, role]
  )

  const getTreePerms = useCallback((): TreeGroup[] => {
    return GROUPS.map((group) => ({
      ...group,
      resources: RESOURCES.filter(
        (resource) => resource.group === group.value
      ).map((resource) => ({
        ...resource,
        perms: PERMS.filter((perm) => {
          const resourceName = perm.value.split(':')[0]
          return resourceName === resource.value
        }),
      })),
    }))
  }, [])

  return {
    GROUPS,
    RESOURCES,
    PERMS,
    getPerm,
    canAccess,
    getTreePerms,
  }
}
