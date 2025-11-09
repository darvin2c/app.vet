'use client'

import { useFormContext } from 'react-hook-form'
import { useEffect } from 'react'
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldError,
} from '@/components/ui/field'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Crown, User } from 'lucide-react'
import { useRoleList } from '@/hooks/roles/use-role-list'
import { UserWithRole } from '@/hooks/users/use-user-list'
import { RoleSelect } from '@/components/roles/role-select'

interface UserRolesFormProps {
  user: UserWithRole
}

export function UserRolesForm({ user }: UserRolesFormProps) {
  const form = useFormContext()
  const { data: roles = [], isPending: rolesLoading } = useRoleList({})

  // Watch the role_ids field and superuser status
  const isSuperuser = form.watch('is_superuser')
  const errors = form.formState.errors

  // Función para obtener las iniciales del usuario
  const getUserInitials = (user: UserWithRole) => {
    const firstName = user.first_name || ''
    const lastName = user.last_name || ''
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  // Función para obtener el nombre completo
  const getFullName = (user: UserWithRole) => {
    const firstName = user.first_name || ''
    const lastName = user.last_name || ''
    return `${firstName} ${lastName}`.trim() || 'Sin nombre'
  }

  // Actualizar el valor del formulario cuando cambie el rol del usuario
  useEffect(() => {
    if (user?.role?.id) {
      form.setValue('role_ids', [user.role.id])
    } else {
      form.setValue('role_ids', ['no-role'])
    }
  }, [user.role?.id, form.setValue])

  return (
    <div className="space-y-6">
      {/* Información del usuario */}
      <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.avatar_url || ''} />
          <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-medium flex items-center gap-2">
            {getFullName(user)}
            {user.is_superuser && <Crown className="h-4 w-4 text-yellow-500" />}
          </h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge
              variant={user.is_active ? 'default' : 'secondary'}
              className="text-xs"
            >
              {user.is_active ? 'Activo' : 'Inactivo'}
            </Badge>
            {user.role && (
              <Badge variant="outline" className="text-xs">
                {user.role.name}
              </Badge>
            )}
          </div>
        </div>
      </div>
      {/* Toggle Super Admin */}
      <Field>
        <FieldLabel htmlFor="is_superuser">Super Administrador</FieldLabel>
        <FieldContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Crown className="h-5 w-5 text-yellow-500" />
              <div>
                <h4 className="font-medium">Super Administrador</h4>
                <p className="text-sm text-muted-foreground">
                  Otorga acceso completo a todas las funciones del sistema
                </p>
              </div>
            </div>
            <Switch
              id="is_superuser"
              checked={form.watch('is_superuser') || false}
              onCheckedChange={(checked) => {
                form.setValue('is_superuser', checked)
                // Si se activa super usuario, quitar otros roles
                if (checked) {
                  form.setValue('role_ids', null)
                }
              }}
            />
          </div>
        </FieldContent>
      </Field>

      {/* Selector de rol */}
      <Field>
        <FieldLabel htmlFor="role_ids" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Rol Asignado
        </FieldLabel>
        <FieldContent>
          <RoleSelect
            onValueChange={(value) => {
              // Si no hay valor seleccionado, establecer null
              form.setValue('role_ids', value || null)
            }}
            disabled={isSuperuser}
            placeholder="Seleccionar rol..."
          />
          <FieldError errors={[errors.role_ids]} />
        </FieldContent>
      </Field>

      {/* Información adicional */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>• Los cambios se aplicarán al presionar "Actualizar Roles"</p>
        <p>• Los super administradores tienen acceso completo al sistema</p>
        <p>• Al activar super usuario se quitan los roles asignados</p>
      </div>
    </div>
  )
}
