import { useCallback, useMemo } from 'react'
import { useProfile } from './use-user'

type Group = {
  value: string
  label: string
  description?: string
}

type Resource = {
  value: string
  label: string
  description: string
  group: string
}

type Perm = {
  value: string // 'resource:action'
  label: string
  description?: string
  can: boolean
}

type TreeGroup = Group & {
  resources: (Resource & {
    perms: Perm[]
  })[]
}

export default function usePerms() {
  const { data: profile } = useProfile()
  const { role, isSuperuser } = profile || {}

  const GROUPS = useMemo(
    () => [
      {
        value: 'vet',
        label: 'Veterinaria',
        description: 'Permisos para la veterinaria',
      },
    ],
    []
  )

  const RESOURCES = useMemo(
    () => [
      {
        value: 'products',
        label: 'Productos',
        description: 'Permisos para productos',
        group: 'vet',
      },
      {
        value: 'customers',
        label: 'Clientes',
        description: 'Permisos para clientes',
        group: 'vet',
      },
    ],
    []
  )

  const PERMS = useMemo(
    () => [
      {
        value: 'products:read',
        label: 'Leer',
        description: 'Permiso para leer productos',
        can: true,
      },
      {
        value: 'products:create',
        label: 'Crear',
        description: 'Permiso para crear productos',
        can: true,
      },
      {
        value: 'products:update',
        label: 'Actualizar',
        description: 'Permiso para actualizar productos',
        can: true,
      },
      {
        value: 'products:delete',
        label: 'Eliminar',
        description: 'Permiso para eliminar productos',
        can: true,
      },
      {
        value: 'customers:read',
        label: 'Leer',
        description: 'Permiso para leer clientes',
        can: true,
      },
      {
        value: 'customers:create',
        label: 'Crear',
        description: 'Permiso para crear clientes',
        can: true,
      },
      {
        value: 'customers:update',
        label: 'Actualizar',
        description: 'Permiso para actualizar clientes',
        can: true,
      },
      {
        value: 'customers:delete',
        label: 'Eliminar',
        description: 'Permiso para eliminar clientes',
        can: true,
      },
    ],
    []
  )

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
  }, [GROUPS, RESOURCES, PERMS])

  return {
    GROUPS,
    RESOURCES,
    PERMS,
    getPerm,
    canAccess,
    getTreePerms,
  }
}
