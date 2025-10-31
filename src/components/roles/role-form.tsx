'use client'

import { useFormContext } from 'react-hook-form'
import { CreateRoleSchema } from '@/schemas/roles.schema'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { PermissionsTree } from './permissions-tree'

export function RoleForm() {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<CreateRoleSchema>()

  const perms = watch('perms') || []

  return (
    <div className="space-y-6">
      {/* Información básica */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Información básica</h3>

        <Field>
          <FieldLabel htmlFor="name">Nombre del rol *</FieldLabel>
          <FieldContent>
            <Input
              id="name"
              placeholder="Ej: Administrador, Veterinario, Recepcionista"
              {...register('name')}
            />
            <FieldError errors={[errors.name]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="description">Descripción</FieldLabel>
          <FieldContent>
            <Textarea
              id="description"
              placeholder="Describe las responsabilidades y funciones de este rol"
              rows={3}
              {...register('description')}
            />
            <FieldError errors={[errors.description]} />
          </FieldContent>
        </Field>
      </div>

      {/* Permisos */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Permisos *</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Selecciona los permisos que tendrá este rol. Puedes expandir cada
            grupo y recurso para ver los permisos específicos.
          </p>
        </div>

        <Field>
          <FieldContent>
            <PermissionsTree
              value={perms}
              onChange={(permissions) => setValue('perms', permissions)}
            />
            <FieldError errors={[errors.perms]} />
          </FieldContent>
        </Field>
      </div>
    </div>
  )
}
