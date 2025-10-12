'use client'

import { useFormContext } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
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

  const selectedColor = form.watch('color')

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre *</FormLabel>
            <FormControl>
              <Input placeholder="Ej: Consulta General" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descripción</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Descripción del tipo de cita"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="color"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Color *</FormLabel>
            <FormControl>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    className="w-12 h-10 p-1 border rounded cursor-pointer"
                    {...field}
                  />
                  <Input
                    type="text"
                    placeholder="#3B82F6"
                    className="flex-1"
                    {...field}
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
                      onClick={() => field.onChange(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
