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
import { Separator } from '@/components/ui/separator'

const taskSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().optional(),
  urgent: z.boolean(),
})

type TaskSchema = z.infer<typeof taskSchema>

import { Trash2 } from 'lucide-react'

// ... (existing imports)

export default function FormSheetDemo() {
  const [open, setOpen] = useState(false)
  const [openLong, setOpenLong] = useState(false)
  const [openExtra, setOpenExtra] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm<TaskSchema>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      urgent: false,
    },
  })

  // Formulario separado para el ejemplo largo para no mezclar estados
  const formLong = useForm<TaskSchema>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      urgent: false,
    },
  })

  const formExtra = useForm<TaskSchema>({
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
    setOpenLong(false)
    setOpenExtra(false)
    form.reset()
    formLong.reset()
    formExtra.reset()
  }

  return (
    <div className="p-8 space-y-4">
      {/* ... (existing header) */}

      <div className="flex gap-4 flex-wrap">
        <Button onClick={() => setOpen(true)}>Crear Tarea (Simple)</Button>
        <Button onClick={() => setOpenLong(true)} variant="outline">
          Crear Tarea (Largo / Scroll)
        </Button>
        <Button onClick={() => setOpenExtra(true)} variant="secondary">
          Crear Tarea (Con Acciones Extra)
        </Button>
      </div>

      {/* Ejemplo Simple */}
      <FormSheet
        open={open}
        onOpenChange={setOpen}
        title="Crear Tarea"
        description="Agrega una nueva tarea a tu lista."
        form={form}
        onSubmit={onSubmit}
        isPending={loading}
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

      {/* Ejemplo con Acciones Extra */}
      <FormSheet
        open={openExtra}
        onOpenChange={setOpenExtra}
        title="Tarea con Acciones"
        description="Ejemplo con botón extra y atajo de teclado (Ctrl+Enter)."
        form={formExtra}
        onSubmit={onSubmit}
        isPending={loading}
        submitLabel="Guardar Cambios"
        extraActions={
          <Button
            variant="destructive"
            type="button"
            onClick={() => alert('Acción de eliminar ejecutada')}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        }
      >
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-md border border-blue-200 text-sm text-blue-800">
            💡 Tip: Intenta presionar <strong>Ctrl + Enter</strong> (o Cmd +
            Enter) para enviar este formulario.
          </div>
          <Field>
            <FieldLabel>Título</FieldLabel>
            <FieldContent>
              <Input
                {...formExtra.register('title')}
                placeholder="Título de la tarea"
              />
            </FieldContent>
            <FieldError errors={[formExtra.formState.errors.title]} />
          </Field>

          <Field>
            <FieldLabel>Descripción</FieldLabel>
            <FieldContent>
              <Input
                {...formExtra.register('description')}
                placeholder="Descripción (opcional)"
              />
            </FieldContent>
            <FieldError errors={[formExtra.formState.errors.description]} />
          </Field>

          <Field orientation="horizontal">
            <FieldContent>
              <Checkbox
                id="urgent-extra"
                checked={formExtra.watch('urgent')}
                onCheckedChange={(checked) =>
                  formExtra.setValue('urgent', checked as boolean)
                }
              />
            </FieldContent>
            <FieldLabel htmlFor="urgent-extra" className="font-normal">
              Marcar como urgente
            </FieldLabel>
          </Field>
        </div>
      </FormSheet>

      {/* Ejemplo Largo con Scroll */}
      <FormSheet
        open={openLong}
        onOpenChange={setOpenLong}
        title="Formulario Extenso"
        description="Este formulario demuestra el comportamiento del scroll cuando hay muchos campos."
        form={formLong}
        onSubmit={onSubmit}
        isPending={loading}
        submitLabel="Guardar Todo"
      >
        <div className="space-y-6">
          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 text-sm text-yellow-800 mb-4">
            ℹ️ Haz scroll hacia abajo para ver cómo el header y footer se
            mantienen fijos.
          </div>

          <Field>
            <FieldLabel>Título Principal</FieldLabel>
            <FieldContent>
              <Input {...formLong.register('title')} placeholder="Título" />
            </FieldContent>
            <FieldError errors={[formLong.formState.errors.title]} />
          </Field>

          <Separator />

          <h3 className="font-medium text-sm text-muted-foreground">
            Información Detallada
          </h3>

          {Array.from({ length: 15 }).map((_, i) => (
            <Field key={i}>
              <FieldLabel>Campo Adicional {i + 1}</FieldLabel>
              <FieldContent>
                <Input
                  placeholder={`Ingresa información para el campo ${i + 1}...`}
                />
              </FieldContent>
            </Field>
          ))}

          <Separator />

          <Field orientation="horizontal">
            <FieldContent>
              <Checkbox
                id="urgent-long"
                checked={formLong.watch('urgent')}
                onCheckedChange={(checked) =>
                  formLong.setValue('urgent', checked as boolean)
                }
              />
            </FieldContent>
            <FieldLabel htmlFor="urgent-long" className="font-normal">
              Confirmar que has revisado todos los campos
            </FieldLabel>
          </Field>
        </div>
      </FormSheet>
    </div>
  )
}
