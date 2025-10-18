'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TimePicker } from '@/components/ui/time-picker'
import { Field, FieldLabel, FieldContent, FieldError } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

// Esquemas de validación
const timeValidationSchema = z.object({
  appointment_time: z
    .string()
    .nonempty('La hora es requerida')
    .refine(
      (value) => {
        // Validar formato 24h (HH:MM)
        const time24hMatch = value.match(/^([01][0-9]|2[0-3]):([0-5][0-9])$/)
        if (time24hMatch) return true
        
        // Validar formato 12h (HH:MM AM/PM)
        const time12hMatch = value.match(/^(0[1-9]|1[0-2]):([0-5][0-9])\s*(AM|PM)$/i)
        if (time12hMatch) return true
        
        return false
      },
      {
        message: 'Formato de tiempo inválido. Use HH:MM para 24h o H:MM AM/PM para 12h',
      }
    ),
  meeting_time: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true // Opcional
        
        // Validar formato 12h
        const time12hMatch = value.match(/^(0[1-9]|1[0-2]):([0-5][0-9])\s*(AM|PM)$/i)
        return !!time12hMatch
      },
      {
        message: 'Use formato H:MM AM/PM para 12h',
      }
    ),
})

type TimeValidationForm = z.infer<typeof timeValidationSchema>

export default function TimePickerDemo() {
  // Estados para ejemplos básicos
  const [time24h, setTime24h] = useState('')
  const [time12h, setTime12h] = useState('')
  const [timeWithError, setTimeWithError] = useState('')
  const [showError, setShowError] = useState(false)

  // Formulario con validación
  const form = useForm<TimeValidationForm>({
    resolver: zodResolver(timeValidationSchema),
    defaultValues: {
      appointment_time: '',
      meeting_time: '',
    },
  })

  const onSubmit = (data: TimeValidationForm) => {
    console.log('Datos del formulario:', data)
    alert(`Formulario enviado:\nCita: ${data.appointment_time}\nReunión: ${data.meeting_time || 'No especificada'}`)
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="h-6 w-6" />
          <h1 className="text-3xl font-bold">TimePicker Demo</h1>
        </div>
        <p className="text-muted-foreground">
          Componente para selección de tiempo con soporte para formatos 12h y 24h, 
          entrada manual inteligente y validación de errores.
        </p>
      </div>

      {/* Ejemplos Básicos */}
      <Card>
        <CardHeader>
          <CardTitle>Ejemplos Básicos</CardTitle>
          <CardDescription>
            TimePicker en diferentes formatos con entrada manual y selección visual.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Formato 24h */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Formato 24h (HH:MM)</label>
              <TimePicker
                format="24h"
                value={time24h}
                onChange={setTime24h}
                placeholder="HH:MM"
              />
              <p className="text-xs text-muted-foreground">
                Valor actual: <code>{time24h || 'vacío'}</code>
              </p>
            </div>

            {/* Formato 12h */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Formato 12h (H:MM AM/PM)</label>
              <TimePicker
                format="12h"
                value={time12h}
                onChange={setTime12h}
                placeholder="H:MM AM/PM"
              />
              <p className="text-xs text-muted-foreground">
                Valor actual: <code>{time12h || 'vacío'}</code>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estados Simplificados */}
      <Card>
        <CardHeader>
          <CardTitle>Estados del Componente</CardTitle>
          <CardDescription>
            Diferentes estados visuales del TimePicker.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Normal */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Normal
              </label>
              <TimePicker
                format="24h"
                value="14:30"
                onChange={() => {}}
                placeholder="HH:MM"
              />
            </div>

            {/* Deshabilitado */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <XCircle className="h-4 w-4 text-gray-400" />
                Deshabilitado
              </label>
              <TimePicker
                format="24h"
                value="09:15"
                onChange={() => {}}
                disabled={true}
                placeholder="HH:MM"
              />
            </div>

            {/* Con Error */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                Con Error
              </label>
              <TimePicker
                format="24h"
                value={timeWithError}
                onChange={setTimeWithError}
                error={showError}
                errorMessage="Hora inválida"
                placeholder="HH:MM"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowError(!showError)}
              >
                {showError ? 'Quitar Error' : 'Mostrar Error'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ejemplos de Tiempos Inválidos */}
      <Card>
        <CardHeader>
          <CardTitle>Ejemplos de Tiempos Inválidos</CardTitle>
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

      {/* Campo de Tiempo con Validación */}
      <Card>
        <CardHeader>
          <CardTitle>Campo de Tiempo con Validación</CardTitle>
          <CardDescription>
            TimePicker integrado con react-hook-form y validación Zod usando Field externo.
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
                      onChange={(value) => form.setValue('appointment_time', value)}
                      error={!!form.formState.errors.appointment_time}
                      errorMessage={form.formState.errors.appointment_time?.message}
                      placeholder="HH:MM"
                    />
                    <FieldError errors={form.formState.errors.appointment_time ? [form.formState.errors.appointment_time] : []} />
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
                    <FieldError errors={form.formState.errors.meeting_time ? [form.formState.errors.meeting_time] : []} />
                  </FieldContent>
                </Field>
              </div>

              <div className="flex gap-4">
                <Button type="submit">
                  Enviar Formulario
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => form.reset()}
                >
                  Limpiar
                </Button>
              </div>

              {/* Estado del formulario */}
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Estado del Formulario:</h4>
                <pre className="text-xs overflow-auto">
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
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Props Principales</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• <code>format</code>: '12h' | '24h'</li>
                <li>• <code>value</code>: string</li>
                <li>• <code>onChange</code>: (value: string) =&gt; void</li>
                <li>• <code>error</code>: boolean</li>
                <li>• <code>errorMessage</code>: string</li>
                <li>• <code>disabled</code>: boolean</li>
                <li>• <code>placeholder</code>: string</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}