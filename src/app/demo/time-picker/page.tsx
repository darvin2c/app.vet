'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TimePicker } from '@/components/ui/time-picker'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'

// Esquema de validación para el formulario
const TimeFormSchema = z
  .object({
    appointment_time: z
      .string()
      .nonempty('La hora de cita es requerida')
      .refine(
        (value) => {
          // Validar formato 24h: HH:MM
          const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
          return timeRegex.test(value)
        },
        {
          message: 'Formato de tiempo inválido. Use HH:MM para 24h',
        }
      ),
    meeting_time: z
      .string()
      .optional()
      .or(z.literal(''))
      .refine(
        (value) => {
          if (!value || value === '') return true
          // Validar formato 12h: H:MM AM/PM
          const timeRegex = /^(1[0-2]|[1-9]):[0-5][0-9] (AM|PM)$/
          return timeRegex.test(value)
        },
        {
          message: 'Formato de tiempo inválido. Use H:MM AM/PM para 12h',
        }
      ),
    start_time: z.string().nonempty('La hora de inicio es requerida'),
    end_time: z.string().nonempty('La hora de fin es requerida'),
    break_time: z.string().optional().or(z.literal('')),
    notification_time: z
      .string()
      .nonempty('La hora de notificación es requerida')
      .refine(
        (value) => {
          // Validar que sea una hora futura (simplificado para demo)
          const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
          return timeRegex.test(value)
        },
        {
          message: 'Formato de tiempo inválido',
        }
      ),
  })
  .refine(
    (data) => {
      // Validar que end_time sea posterior a start_time
      if (data.start_time && data.end_time) {
        const [startHour, startMin] = data.start_time.split(':').map(Number)
        const [endHour, endMin] = data.end_time.split(':').map(Number)
        const startMinutes = startHour * 60 + startMin
        const endMinutes = endHour * 60 + endMin
        return endMinutes > startMinutes
      }
      return true
    },
    {
      message: 'La hora de fin debe ser posterior a la hora de inicio',
      path: ['end_time'],
    }
  )

type TimeFormData = z.infer<typeof TimeFormSchema>

export default function TimePickerDemo() {
  // Estados para ejemplos básicos
  const [time24h, setTime24h] = useState('')
  const [time12h, setTime12h] = useState('')
  const [timeWithError, setTimeWithError] = useState('')
  const [showError, setShowError] = useState(false)

  // Form para ejemplos con React Hook Form
  const form = useForm<TimeFormData>({
    resolver: zodResolver(TimeFormSchema),
    defaultValues: {
      appointment_time: '',
      meeting_time: '',
      start_time: '',
      end_time: '',
      break_time: '',
      notification_time: '',
    },
  })

  const clearAllTimes = () => {
    setTime24h('')
    setTime12h('')
    setTimeWithError('')
    setShowError(false)
    form.reset()
  }

  const handleErrorToggle = () => {
    setShowError(!showError)
  }

  const onSubmit = (data: TimeFormData) => {
    console.log('Datos del formulario:', data)
    alert(
      'Formulario enviado correctamente. Revisa la consola para ver los datos.'
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">TimePicker Component Demo</h1>
        <p className="text-muted-foreground">
          Componente reutilizable para selección de tiempo con entrada manual
          inteligente y selección visual. Soporta formatos 12h y 24h con
          validación automática.
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <Button onClick={clearAllTimes} variant="outline">
          Limpiar todos los tiempos
        </Button>
        <Button onClick={handleErrorToggle} variant="outline">
          {showError ? 'Ocultar' : 'Mostrar'} error
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* TimePicker 24h */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              TimePicker 24h
              <Badge variant="default">Formato 24h</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <TimePicker
              format="24h"
              value={time24h}
              onChange={setTime24h}
              placeholder="HH:MM"
            />
            <div className="text-sm text-muted-foreground">
              <strong>Valor:</strong> {time24h || 'No seleccionado'}
            </div>
            <div className="text-xs text-muted-foreground">
              Formato 24 horas (00:00 - 23:59). Entrada manual con máscara
              automática.
            </div>
          </CardContent>
        </Card>

        {/* TimePicker 12h */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              TimePicker 12h
              <Badge variant="secondary">Formato 12h</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <TimePicker
              format="12h"
              value={time12h}
              onChange={setTime12h}
              placeholder="H:MM AM/PM"
            />
            <div className="text-sm text-muted-foreground">
              <strong>Valor:</strong> {time12h || 'No seleccionado'}
            </div>
            <div className="text-xs text-muted-foreground">
              Formato 12 horas con AM/PM (1:00 AM - 12:59 PM). Selección visual
              incluida.
            </div>
          </CardContent>
        </Card>

        {/* TimePicker con Error */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              TimePicker con Error
              <Badge variant="destructive">Estado de error</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <TimePicker
              format="24h"
              value={timeWithError}
              onChange={setTimeWithError}
              error={showError}
              errorMessage={
                showError ? 'Formato de tiempo inválido' : undefined
              }
              placeholder="HH:MM"
            />
            <div className="text-sm text-muted-foreground">
              <strong>Valor:</strong> {timeWithError || 'No seleccionado'}
            </div>
            <div className="text-xs text-muted-foreground">
              Muestra estados de error con estilos visuales y mensajes de
              validación.
            </div>
          </CardContent>
        </Card>

        {/* TimePicker Deshabilitado */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              TimePicker Deshabilitado
              <Badge variant="outline">disabled=true</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <TimePicker
              format="12h"
              value="2:30 PM"
              disabled={true}
              placeholder="H:MM AM/PM"
            />
            <div className="text-sm text-muted-foreground">
              <strong>Valor:</strong> 2:30 PM (fijo)
            </div>
            <div className="text-xs text-muted-foreground">
              Estado deshabilitado con opacidad reducida y cursor not-allowed.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Casos de Validación */}
      <Card>
        <CardHeader>
          <CardTitle>Casos de Validación Automática</CardTitle>
          <CardDescription>
            Casos que el TimePicker rechaza automáticamente durante la entrada.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Formato 24h - Casos inválidos */}
            <div className="space-y-3">
              <h4 className="font-medium">Formato 24h - Casos Inválidos</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">❌</Badge>
                  <code>25:00</code> - Hora mayor a 23
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">❌</Badge>
                  <code>12:60</code> - Minutos mayor a 59
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">❌</Badge>
                  <code>24:30</code> - Hora 24 no válida
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">❌</Badge>
                  <code>1:5</code> - Formato incompleto
                </div>
              </div>
            </div>

            {/* Formato 12h - Casos inválidos */}
            <div className="space-y-3">
              <h4 className="font-medium">Formato 12h - Casos Inválidos</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">❌</Badge>
                  <code>13:00 AM</code> - Hora mayor a 12
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">❌</Badge>
                  <code>00:30 PM</code> - Hora 0 no válida
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">❌</Badge>
                  <code>12:60 AM</code> - Minutos mayor a 59
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">❌</Badge>
                  <code>8:30</code> - Falta AM/PM
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-medium">Casos Extremos</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">❌</Badge>
                  <code>abc:def</code> - Caracteres no numéricos
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">❌</Badge>
                  <code>99:99</code> - Valores fuera de rango
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">❌</Badge>
                  <code>12:30 XM</code> - Período inválido
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">❌</Badge>
                  <code>:</code> - Solo separadores
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* React Hook Form Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            TimePicker con React Hook Form
            <Badge variant="default">RHF + Zod</Badge>
          </CardTitle>
          <CardDescription>
            TimePicker integrado con react-hook-form y validación Zod usando
            Field externo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Campo requerido con validación */}
                <Field>
                  <FieldLabel htmlFor="appointment_time">
                    Hora de Cita
                    <span className="text-destructive ml-1">*</span>
                  </FieldLabel>
                  <FieldContent>
                    <TimePicker
                      id="appointment_time"
                      name="appointment_time"
                      format="24h"
                      value={form.watch('appointment_time')}
                      onChange={(value) =>
                        form.setValue('appointment_time', value)
                      }
                      error={!!form.formState.errors.appointment_time}
                      errorMessage={
                        form.formState.errors.appointment_time?.message
                      }
                      placeholder="HH:MM"
                    />
                    <FieldError
                      errors={
                        form.formState.errors.appointment_time
                          ? [form.formState.errors.appointment_time]
                          : []
                      }
                    />
                  </FieldContent>
                </Field>

                {/* Campo opcional */}
                <Field>
                  <FieldLabel htmlFor="meeting_time">
                    Hora de Reunión (Opcional)
                  </FieldLabel>
                  <FieldContent>
                    <TimePicker
                      id="meeting_time"
                      name="meeting_time"
                      format="12h"
                      value={form.watch('meeting_time') || ''}
                      onChange={(value) => form.setValue('meeting_time', value)}
                      error={!!form.formState.errors.meeting_time}
                      errorMessage={form.formState.errors.meeting_time?.message}
                      placeholder="H:MM AM/PM"
                    />
                    <FieldError
                      errors={
                        form.formState.errors.meeting_time
                          ? [form.formState.errors.meeting_time]
                          : []
                      }
                    />
                  </FieldContent>
                </Field>

                {/* Rango de Tiempo - Inicio */}
                <Field>
                  <FieldLabel htmlFor="start_time">Hora de Inicio *</FieldLabel>
                  <FieldContent>
                    <TimePicker
                      id="start_time"
                      name="start_time"
                      format="24h"
                      value={form.watch('start_time')}
                      onChange={(value) => form.setValue('start_time', value)}
                      error={!!form.formState.errors.start_time}
                      errorMessage={form.formState.errors.start_time?.message}
                      placeholder="HH:MM"
                    />
                    <FieldError
                      errors={
                        form.formState.errors.start_time
                          ? [form.formState.errors.start_time]
                          : []
                      }
                    />
                  </FieldContent>
                </Field>

                {/* Rango de Tiempo - Fin */}
                <Field>
                  <FieldLabel htmlFor="end_time">Hora de Fin *</FieldLabel>
                  <FieldContent>
                    <TimePicker
                      id="end_time"
                      name="end_time"
                      format="24h"
                      value={form.watch('end_time')}
                      onChange={(value) => form.setValue('end_time', value)}
                      error={!!form.formState.errors.end_time}
                      errorMessage={form.formState.errors.end_time?.message}
                      placeholder="HH:MM"
                    />
                    <FieldError
                      errors={
                        form.formState.errors.end_time
                          ? [form.formState.errors.end_time]
                          : []
                      }
                    />
                  </FieldContent>
                </Field>

                {/* Tiempo de Descanso */}
                <Field>
                  <FieldLabel htmlFor="break_time">
                    Hora de Descanso (Opcional)
                  </FieldLabel>
                  <FieldContent>
                    <TimePicker
                      id="break_time"
                      name="break_time"
                      format="12h"
                      value={form.watch('break_time') || ''}
                      onChange={(value) => form.setValue('break_time', value)}
                      error={!!form.formState.errors.break_time}
                      errorMessage={form.formState.errors.break_time?.message}
                      placeholder="H:MM AM/PM"
                    />
                    <FieldError
                      errors={
                        form.formState.errors.break_time
                          ? [form.formState.errors.break_time]
                          : []
                      }
                    />
                  </FieldContent>
                </Field>

                {/* Tiempo de Notificación */}
                <Field>
                  <FieldLabel htmlFor="notification_time">
                    Hora de Notificación *
                  </FieldLabel>
                  <FieldContent>
                    <TimePicker
                      id="notification_time"
                      name="notification_time"
                      format="24h"
                      value={form.watch('notification_time')}
                      onChange={(value) =>
                        form.setValue('notification_time', value)
                      }
                      error={!!form.formState.errors.notification_time}
                      errorMessage={
                        form.formState.errors.notification_time?.message
                      }
                      placeholder="HH:MM"
                    />
                    <FieldError
                      errors={
                        form.formState.errors.notification_time
                          ? [form.formState.errors.notification_time]
                          : []
                      }
                    />
                  </FieldContent>
                </Field>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit">Enviar Formulario</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                >
                  Limpiar Formulario
                </Button>
              </div>

              {/* Estado del formulario */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Estado del Formulario:</h4>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(form.watch(), null, 2)}
                </pre>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>

      {/* Información Técnica */}
      <Card>
        <CardHeader>
          <CardTitle>Información Técnica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Características</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Entrada manual inteligente con máscara</li>
                <li>• Validación en tiempo real</li>
                <li>• Soporte para formatos 12h y 24h</li>
                <li>• Selección visual con popover/sheet</li>
                <li>• Integración con react-hook-form</li>
                <li>• Estados de error y validación</li>
                <li>• Accesibilidad completa (ARIA)</li>
                <li>• Responsive (mobile/desktop)</li>
                <li>• Validación de rangos de tiempo</li>
                <li>• Soporte para campos opcionales</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Props Principales</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>
                  • <code>format</code>: '12h' | '24h'
                </li>
                <li>
                  • <code>value</code>: string
                </li>
                <li>
                  • <code>onChange</code>: (value: string) =&gt; void
                </li>
                <li>
                  • <code>error</code>: boolean
                </li>
                <li>
                  • <code>errorMessage</code>: string
                </li>
                <li>
                  • <code>disabled</code>: boolean
                </li>
                <li>
                  • <code>placeholder</code>: string
                </li>
                <li>
                  • <code>name</code>: string (para formularios)
                </li>
                <li>
                  • <code>id</code>: string (para accesibilidad)
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
