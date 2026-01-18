'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { FormSheet } from '@/components/ui/form-sheet'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from '@/components/ui/field'
import { Checkbox } from '@/components/ui/checkbox'

const taskSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().optional(),
  urgent: z.boolean(),
})

type TaskSchema = z.infer<typeof taskSchema>

export default function FormSheetDemo() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm<TaskSchema>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      urgent: false,
    },
  })

  const onSubmit = async (data: TaskSchema) => {
    setLoading(true)
    console.log('Submitting:', data)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    alert(JSON.stringify(data, null, 2))
    setLoading(false)
    setOpen(false)
    form.reset()
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">FormSheet Demo</h1>
      <p className="text-muted-foreground">
        Ejemplo de uso del componente FormSheet para formularios en sheets
        laterales.
      </p>

      <Button onClick={() => setOpen(true)}>Crear Tarea</Button>

      <FormSheet
        open={open}
        onOpenChange={setOpen}
        title="Crear Tarea"
        description="Agrega una nueva tarea a tu lista."
        form={form}
        onSubmit={onSubmit}
        isLoading={loading}
        submitLabel="Crear Tarea"
      >
        <div className="space-y-4">
          <Field>
            <FieldLabel>Título</FieldLabel>
            <FieldContent>
              <Input
                {...form.register('title')}
                placeholder="Título de la tarea"
              />
            </FieldContent>
            <FieldError errors={[form.formState.errors.title]} />
          </Field>

          <Field>
            <FieldLabel>Descripción</FieldLabel>
            <FieldContent>
              <Input
                {...form.register('description')}
                placeholder="Descripción (opcional)"
              />
            </FieldContent>
            <FieldError errors={[form.formState.errors.description]} />
          </Field>

          <Field orientation="horizontal">
            <FieldContent>
              <Checkbox
                id="urgent"
                checked={form.watch('urgent')}
                onCheckedChange={(checked) =>
                  form.setValue('urgent', checked as boolean)
                }
              />
            </FieldContent>
            <FieldLabel htmlFor="urgent" className="font-normal">
              Marcar como urgente
            </FieldLabel>
          </Field>
        </div>
      </FormSheet>
    </div>
  )
}
