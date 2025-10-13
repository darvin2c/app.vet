'use client'

import { useFormContext } from 'react-hook-form'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type {
  CreateAppointmentTypeSchema,
  UpdateAppointmentTypeSchema,
} from '@/schemas/appointment-types.schema'

const PRESET_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#F97316', // Orange
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#EC4899', // Pink
  '#6B7280', // Gray
]

export function AppointmentTypeForm() {
  const form = useFormContext<
    CreateAppointmentTypeSchema | UpdateAppointmentTypeSchema
  >()
  const {
    formState: { errors },
  } = form

  const selectedColor = form.watch('color')

  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel htmlFor="name">Nombre *</FieldLabel>
        <FieldContent>
          <Input
            id="name"
            placeholder="Ej: Consulta General"
            {...form.register('name')}
          />
          <FieldError errors={[errors.name]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="description">Descripción</FieldLabel>
        <FieldContent>
          <Textarea
            id="description"
            placeholder="Descripción del tipo de cita"
            {...form.register('description')}
          />
          <FieldError errors={[errors.description]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="color">Color *</FieldLabel>
        <FieldContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Input
                id="color"
                type="color"
                className="w-12 h-10 p-1 border rounded cursor-pointer"
                {...form.register('color')}
              />
              <Input
                type="text"
                placeholder="#3B82F6"
                className="flex-1"
                {...form.register('color')}
              />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded border-2 transition-all ${
                    selectedColor === color
                      ? 'border-foreground scale-110'
                      : 'border-muted hover:border-muted-foreground'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => form.setValue('color', color)}
                  title={color}
                />
              ))}
            </div>
          </div>
          <FieldError errors={[errors.color]} />
        </FieldContent>
      </Field>
    </div>
  )
}
