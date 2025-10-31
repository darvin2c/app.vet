'use client'

import { useFormContext } from 'react-hook-form'
import { useEffect } from 'react'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Crown, User } from 'lucide-react'
import { useRoleList } from '@/hooks/roles/use-role-list'

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

interface UserRolesFormProps {
  user: UserWithRole
  onSuperAdminToggle: () => void
  isSuperAdminToggling: boolean
}

export function UserRolesForm({
  user,
  onSuperAdminToggle,
  isSuperAdminToggling,
}: UserRolesFormProps) {
  const form = useFormContext()
  const { data: roles = [], isPending: rolesLoading } = useRoleList({})

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
    if (user.tenant_user.role_id) {
      form.setValue('role_ids', [user.tenant_user.role_id])
    } else {
      form.setValue('role_ids', ['no-role'])
    }
  }, [user.tenant_user.role_id, form])

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
            {user.tenant_user.is_superuser && (
              <Crown className="h-4 w-4 text-yellow-500" />
            )}
          </h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge
              variant={user.tenant_user.is_active ? 'default' : 'secondary'}
              className="text-xs"
            >
              {user.tenant_user.is_active ? 'Activo' : 'Inactivo'}
            </Badge>
            {user.tenant_user.role && (
              <Badge variant="outline" className="text-xs">
                {user.tenant_user.role.name}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Selector de rol */}
      <FormField
        control={form.control}
        name="role_ids"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Rol Asignado
            </FormLabel>
            <FormControl>
              <Select
                value={field.value?.[0] || 'no-role'}
                onValueChange={(value) => field.onChange([value])}
                disabled={rolesLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-role">Sin rol</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{role.name}</span>
                        {role.description && (
                          <span className="text-xs text-muted-foreground">
                            {role.description}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Toggle Super Admin */}
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
          checked={user.tenant_user.is_superuser}
          onCheckedChange={onSuperAdminToggle}
          disabled={isSuperAdminToggling}
        />
      </div>

      {/* Información adicional */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>• Los cambios de rol se aplicarán inmediatamente</p>
        <p>• Los super administradores tienen acceso completo al sistema</p>
        <p>• Un usuario puede tener solo un rol asignado</p>
      </div>
    </div>
  )
}
