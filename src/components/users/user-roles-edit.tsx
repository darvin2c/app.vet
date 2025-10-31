'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer-form'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { UserRolesForm } from './user-roles-form'
import {
  updateUserRolesSchema,
  UpdateUserRolesSchema,
} from '@/schemas/users.schema'
import {
  useUserRoleUpdate,
  useUserSuperAdminToggle,
} from '@/hooks/users/use-user-roles-update'
import { Settings } from 'lucide-react'

type UserWithRole = {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  avatar_url: string | null
  tenant_user: {
    id: string
    role_id: string | null
    is_superuser: boolean
    is_active: boolean
    role: {
      id: string
      name: string
      description: string | null
    } | null
  }
}

interface UserRolesEditProps {
  user: UserWithRole
}

export function UserRolesEdit({ user }: UserRolesEditProps) {
  const [open, setOpen] = useState(false)
  const updateUserRole = useUserRoleUpdate()
  const toggleSuperAdmin = useUserSuperAdminToggle()

  const form = useForm({
    resolver: zodResolver(updateUserRolesSchema),
    defaultValues: {
      role_ids: user.tenant_user.role_id ? [user.tenant_user.role_id] : [],
    },
  })

  const onSubmit = async (data: UpdateUserRolesSchema) => {
    try {
      // Actualizar rol del usuario
      if (data.role_ids.length > 0) {
        await updateUserRole.mutateAsync({
          userId: user.id,
          roleId: data.role_ids[0], // Solo un rol por usuario
        })
      }

      setOpen(false)
    } catch (error) {
      console.error('Error updating user roles:', error)
    }
  }

  const handleSuperAdminToggle = async () => {
    try {
      await toggleSuperAdmin.mutateAsync({
        userId: user.id,
        isSuperuser: !user.tenant_user.is_superuser,
      })
    } catch (error) {
      console.error('Error toggling super admin:', error)
    }
  }

  const getFullName = (user: UserWithRole) => {
    const firstName = user.first_name || ''
    const lastName = user.last_name || ''
    return `${firstName} ${lastName}`.trim() || 'Sin nombre'
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="!w-full !max-w-md">
        <DrawerHeader>
          <DrawerTitle>Editar Roles de Usuario</DrawerTitle>
          <DrawerDescription>
            Gestiona los roles y permisos de {getFullName(user)}
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <UserRolesForm
                user={user}
                onSuperAdminToggle={handleSuperAdminToggle}
                isSuperAdminToggling={toggleSuperAdmin.isPending}
              />
            </form>
          </Form>
        </div>

        <DrawerFooter>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            disabled={updateUserRole.isPending}
          >
            {updateUserRole.isPending ? 'Actualizando...' : 'Actualizar Roles'}
          </Button>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={updateUserRole.isPending}
          >
            Cancelar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
