import { useFormContext } from 'react-hook-form'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RoleSelect } from '@/components/roles/role-select'
import { DatePicker } from '@/components/ui/date-picker'
import { useRoleList } from '@/hooks/roles/use-role-list'

export function UserInviteForm() {
  const form = useFormContext()
  const { data: rolesData } = useRoleList({})

  return (
    <div className="space-y-4">
      <Field>
        <label htmlFor="emails">Correos electrónicos</label>
        <Textarea
          id="emails"
          placeholder="uno por línea"
          {...form.register('emailsText')}
        />
      </Field>

      <Field>
        <label>Rol</label>
        <RoleSelect
          value={form.watch('role_id')}
          onValueChange={(v) => form.setValue('role_id', v)}
        />
      </Field>

      <Field>
        <label htmlFor="expires_at">Expira el</label>
        <DatePicker
          value={form.watch('expires_at')}
          onChange={(v) =>
            form.setValue('expires_at', v ? v.toISOString() : '')
          }
        />
      </Field>

      <Field>
        <label htmlFor="message">Mensaje</label>
        <Textarea id="message" {...form.register('message')} />
      </Field>
    </div>
  )
}
