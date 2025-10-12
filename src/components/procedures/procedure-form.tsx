'use client'

import { useFormContext } from 'react-hook-form'
import { CreateProcedureSchema } from '@/schemas/procedures.schema'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { IsActiveFormField } from '@/components/ui/is-active-field'
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldError,
} from '@/components/ui/field'

export function ProcedureForm() {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateProcedureSchema>()

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="name">Nombre del Procedimiento *</FieldLabel>
          <FieldContent>
            <Input
              id="name"
              placeholder="Ej: Limpieza dental"
              {...control.register('name')}
            />
            <FieldError errors={[errors.name]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="code">Código *</FieldLabel>
          <FieldContent>
            <Input
              id="code"
              placeholder="Ej: LIMP-001"
              {...control.register('code')}
            />
            <FieldError errors={[errors.code]} />
          </FieldContent>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="description">Descripción</FieldLabel>
        <FieldContent>
          <Textarea
            id="description"
            placeholder="Describa el procedimiento médico"
            className="resize-none"
            rows={3}
            {...control.register('description')}
          />
          <FieldError errors={[errors.description]} />
        </FieldContent>
      </Field>

      <div className="grid grid-cols-3 gap-4">
        <Field>
          <FieldLabel htmlFor="base_price">Precio Base</FieldLabel>
          <FieldContent>
            <Input
              id="base_price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              {...control.register('base_price', {
                valueAsNumber: true,
                setValueAs: (value) => (value === '' ? null : Number(value)),
              })}
            />
            <FieldError errors={[errors.base_price]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="cdt_code">Código CDT</FieldLabel>
          <FieldContent>
            <Input
              id="cdt_code"
              placeholder="Ej: D1110"
              {...control.register('cdt_code')}
            />
            <FieldError errors={[errors.cdt_code]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="snomed_code">Código SNOMED</FieldLabel>
          <FieldContent>
            <Input
              id="snomed_code"
              placeholder="Ej: 234947008"
              {...control.register('snomed_code')}
            />
            <FieldError errors={[errors.snomed_code]} />
          </FieldContent>
        </Field>
      </div>

      <IsActiveFormField
        name="active"
        label="Estado del Procedimiento"
        description="Determina si el procedimiento está disponible para uso"
        activeText="Activo"
        inactiveText="Inactivo"
      />
    </div>
  )
}
