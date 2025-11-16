import { useFormContext } from 'react-hook-form'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { RoleSelect } from '@/components/roles/role-select'
import { useRoleList } from '@/hooks/roles/use-role-list'
import { invitationSendFormSchemaType } from '@/schemas/invitations.schema'

export function UserInviteForm() {
  const form = useFormContext<invitationSendFormSchemaType>()
  const { data: rolesData } = useRoleList({})

  return (
    <div className="space-y-4">
      <Field
        orientation="responsive"
        data-invalid={!!form.formState.errors.email}
      >
        <FieldContent>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <FieldDescription>
            El email del usuario al que se le enviará la invitación.
          </FieldDescription>
        </FieldContent>
        <Input
          id="email"
          type="email"
          placeholder="usuario@correo.com"
          {...form.register('email')}
        />
        <FieldError errors={[form.formState.errors.email]} />
      </Field>

      <Field
        orientation="responsive"
        data-invalid={!!form.formState.errors.role_id}
      >
        <FieldContent>
          <FieldLabel htmlFor="role_id">Rol</FieldLabel>
          <FieldDescription>
            El rol que tendrá el usuario cuando acepte la invitación.
          </FieldDescription>
        </FieldContent>
        <RoleSelect
          value={form.watch('role_id')}
          onValueChange={(v) => form.setValue('role_id', v)}
        />
        <FieldError errors={[form.formState.errors.role_id]} />
      </Field>
    </div>
  )
}
