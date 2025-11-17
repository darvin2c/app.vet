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
      {
        value: 'sales',
        label: 'Ventas',
        description: 'Permisos para ventas',
      },
      {
        value: 'settings',
        label: 'Configuraciones',
        description: 'Permisos para configuraciones',
      },
      {
        value: 'security',
        label: 'Seguridad',
        description: 'Permisos para seguridad',
      },
    ],
    []
  )

  const RESOURCES = useMemo(
    () => [
      {
        value: 'customers',
        label: 'Clientes',
        description: 'Permisos para clientes',
        group: 'vet',
      },
      {
        value: 'pets',
        label: 'Mascotas',
        description: 'Permisos para mascotas',
        group: 'vet',
      },
      // sales
      {
        value: 'orders',
        label: 'Órdenes',
        description: 'Permisos para órdenes',
        group: 'sales',
      },
      {
        value: 'payments',
        label: 'Pagos',
        description: 'Permisos para pagos',
        group: 'sales',
      },
      {
        value: 'products',
        label: 'Productos',
        description: 'Permisos para productos',
        group: 'sales',
      },
      {
        value: 'services',
        label: 'Servicios',
        description: 'Permisos para servicios',
        group: 'sales',
      },
      // Settings
      // Security
      {
        value: 'users',
        label: 'Usuarios',
        description: 'Permisos para usuarios',
        group: 'security',
      },
      {
        value: 'roles',
        label: 'Roles',
        description: 'Permisos para roles',
        group: 'security',
      },
    ],
    []
  )

  const PERMS = useMemo(
    () => [
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
      {
        value: 'pets:read',
        label: 'Leer',
        description: 'Permiso para leer mascotas',
        can: true,
      },
      {
        value: 'pets:create',
        label: 'Crear',
        description: 'Permiso para crear mascotas',
        can: true,
      },
      {
        value: 'pets:update',
        label: 'Actualizar',
        description: 'Permiso para actualizar mascotas',
        can: true,
      },
      {
        value: 'pets:delete',
        label: 'Eliminar',
        description: 'Permiso para eliminar mascotas',
        can: true,
      },
      // sales
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
        value: 'services:read',
        label: 'Leer',
        description: 'Permiso para leer servicios',
        can: true,
      },
      {
        value: 'services:create',
        label: 'Crear',
        description: 'Permiso para crear servicios',
        can: true,
      },
      {
        value: 'services:update',
        label: 'Actualizar',
        description: 'Permiso para actualizar servicios',
        can: true,
      },
      {
        value: 'services:delete',
        label: 'Eliminar',
        description: 'Permiso para eliminar servicios',
        can: true,
      },
      {
        value: 'customers:read',
        label: 'Leer',
        description: 'Permiso para leer clientes',
        can: true,
      },
      {
        value: 'orders:read',
        label: 'Leer',
        description: 'Permiso para leer órdenes',
        can: true,
      },
      {
        value: 'orders:create',
        label: 'Crear',
        description: 'Permiso para crear órdenes',
        can: true,
      },
      {
        value: 'orders:update',
        label: 'Actualizar',
        description: 'Permiso para actualizar órdenes',
        can: true,
      },
      {
        value: 'orders:delete',
        label: 'Eliminar',
        description: 'Permiso para eliminar órdenes',
        can: true,
      },
      {
        value: 'orders:pay',
        label: 'Pagar',
        description: 'Permiso para pagar órdenes',
        can: true,
      },
      // Security
      {
        value: 'users:read',
        label: 'Leer',
        description: 'Permiso para leer usuarios',
        can: true,
      },
      {
        value: 'users:invite',
        label: 'Invitar',
        description: 'Permiso para invitar usuarios',
        can: true,
      },
      {
        value: 'users:update',
        label: 'Actualizar',
        description: 'Permiso para actualizar usuarios',
        can: true,
      },
      {
        value: 'roles:delete',
        label: 'Eliminar',
        description: 'Permiso para eliminar roles',
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
