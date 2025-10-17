'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { TimePicker, getTimeSchema } from '@/components/ui/time-picker'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

// Esquemas para formularios
const appointmentSchema = z.object({
  startTime: getTimeSchema('12h'),
  endTime: getTimeSchema('12h'),
  reminderTime: getTimeSchema('24h'),
})

const scheduleSchema = z.object({
  openTime: getTimeSchema('24h'),
  closeTime: getTimeSchema('24h'),
  lunchStart: getTimeSchema('12h'),
  lunchEnd: getTimeSchema('12h'),
})

type AppointmentForm = z.infer<typeof appointmentSchema>
type ScheduleForm = z.infer<typeof scheduleSchema>

export default function TimePickerDemo() {
  // Estados para demos básicos
  const [time12h, setTime12h] = useState('')
  const [time24h, setTime24h] = useState('')
  const [timeWithError, setTimeWithError] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Formulario de citas
  const appointmentForm = useForm<AppointmentForm>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      startTime: '',
      endTime: '',
      reminderTime: '',
    },
  })

  // Formulario de horarios
  const scheduleForm = useForm<ScheduleForm>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      openTime: '',
      closeTime: '',
      lunchStart: '',
      lunchEnd: '',
    },
  })

  // Manejar envío de formulario de citas
  const onAppointmentSubmit = (data: AppointmentForm) => {
    toast.success('Cita programada correctamente', {
      description: `Inicio: ${data.startTime}, Fin: ${data.endTime}, Recordatorio: ${data.reminderTime}`,
    })
  }

  // Manejar envío de formulario de horarios
  const onScheduleSubmit = (data: ScheduleForm) => {
    toast.success('Horario configurado correctamente', {
      description: `Apertura: ${data.openTime}, Cierre: ${data.closeTime}`,
    })
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">TimePicker Component Demo</h1>
        <p className="text-muted-foreground">
          Componente completamente autocontenido para selección de tiempo con
          soporte para formatos 12h y 24h
        </p>
      </div>

      {/* Características del componente */}
      <Card>
        <CardHeader>
          <CardTitle>Características Principales</CardTitle>
          <CardDescription>
            El componente TimePicker incluye las siguientes funcionalidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Funcionalidades</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Máscara de entrada adaptativa</li>
                <li>• Selector activado por ícono de reloj</li>
                <li>• Diseño completamente responsivo</li>
                <li>• Validación en tiempo real</li>
                <li>• Soporte para formatos 12h y 24h</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Props Principales</h4>
              <div className="space-y-1">
                <Badge variant="outline">
                  format: &quot;12h&quot; | &quot;24h&quot;
                </Badge>
                <Badge variant="outline">value?: string</Badge>
                <Badge variant="outline">
                  onChange?: (value: string) =&gt; void
                </Badge>
                <Badge variant="outline">disabled?: boolean</Badge>
                <Badge variant="outline">error?: string</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Demo básico - Formato 12h */}
      <Card>
        <CardHeader>
          <CardTitle>Formato 12 Horas (AM/PM)</CardTitle>
          <CardDescription>
            TimePicker con formato 12h que incluye selector AM/PM
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Hora de Cita</label>
              <TimePicker
                format="12h"
                value={time12h}
                onChange={setTime12h}
                placeholder="Seleccionar hora"
              />
              {time12h && (
                <p className="text-sm text-muted-foreground">
                  Valor seleccionado:{' '}
                  <code className="bg-muted px-1 rounded">{time12h}</code>
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Hora Deshabilitada</label>
              <TimePicker
                format="12h"
                value="02:30 PM"
                disabled
                placeholder="Campo deshabilitado"
              />
              <p className="text-sm text-muted-foreground">
                Campo deshabilitado con valor predeterminado
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo básico - Formato 24h */}
      <Card>
        <CardHeader>
          <CardTitle>Formato 24 Horas</CardTitle>
          <CardDescription>
            TimePicker con formato 24h sin selector AM/PM
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Hora Militar</label>
              <TimePicker
                format="24h"
                value={time24h}
                onChange={setTime24h}
                placeholder="HH:MM"
              />
              {time24h && (
                <p className="text-sm text-muted-foreground">
                  Valor seleccionado:{' '}
                  <code className="bg-muted px-1 rounded">{time24h}</code>
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Con Error Personalizado
              </label>
              <TimePicker
                format="24h"
                value={timeWithError}
                onChange={setTimeWithError}
                onError={setError}
                error={error || undefined}
                placeholder="Ingrese hora inválida"
              />
              <p className="text-sm text-muted-foreground">
                Pruebe ingresar una hora inválida para ver la validación
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Demo con formularios - Citas */}
      <Card>
        <CardHeader>
          <CardTitle>Integración con Formularios - Citas</CardTitle>
          <CardDescription>
            Ejemplo de uso con react-hook-form y validación Zod
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...appointmentForm}>
            <form
              onSubmit={appointmentForm.handleSubmit(onAppointmentSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={appointmentForm.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora de Inicio</FormLabel>
                      <FormControl>
                        <TimePicker
                          format="12h"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="HH:MM AM/PM"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={appointmentForm.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora de Fin</FormLabel>
                      <FormControl>
                        <TimePicker
                          format="12h"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="HH:MM AM/PM"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={appointmentForm.control}
                name="reminderTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de Recordatorio (24h)</FormLabel>
                    <FormControl>
                      <TimePicker
                        format="24h"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="HH:MM"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full md:w-auto">
                Programar Cita
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Demo con formularios - Horarios */}
      <Card>
        <CardHeader>
          <CardTitle>
            Integración con Formularios - Horarios de Trabajo
          </CardTitle>
          <CardDescription>
            Configuración de horarios con diferentes formatos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...scheduleForm}>
            <form
              onSubmit={scheduleForm.handleSubmit(onScheduleSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={scheduleForm.control}
                  name="openTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora de Apertura (24h)</FormLabel>
                      <FormControl>
                        <TimePicker
                          format="24h"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="HH:MM"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={scheduleForm.control}
                  name="closeTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora de Cierre (24h)</FormLabel>
                      <FormControl>
                        <TimePicker
                          format="24h"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="HH:MM"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={scheduleForm.control}
                  name="lunchStart"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inicio de Almuerzo (12h)</FormLabel>
                      <FormControl>
                        <TimePicker
                          format="12h"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="HH:MM AM/PM"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={scheduleForm.control}
                  name="lunchEnd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fin de Almuerzo (12h)</FormLabel>
                      <FormControl>
                        <TimePicker
                          format="12h"
                          value={field.value || undefined}
                          onChange={field.onChange}
                          placeholder="HH:MM AM/PM"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full md:w-auto">
                Guardar Horarios
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Casos de validación */}
      <Card>
        <CardHeader>
          <CardTitle>Casos de Validación</CardTitle>
          <CardDescription>
            Ejemplos de diferentes estados de validación y error
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Hora Válida (12h)</label>
              <TimePicker
                format="12h"
                value="09:30 AM"
                onChange={() => {}}
                placeholder="HH:MM AM/PM"
              />
              <p className="text-sm text-green-600">✓ Formato válido</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Hora Válida (24h)</label>
              <TimePicker
                format="24h"
                value="14:45"
                onChange={() => {}}
                placeholder="HH:MM"
              />
              <p className="text-sm text-green-600">✓ Formato válido</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Error Personalizado</label>
              <TimePicker
                format="12h"
                value=""
                onChange={() => {}}
                error="Este campo es requerido"
                placeholder="HH:MM AM/PM"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Campo Requerido</label>
              <TimePicker
                format="24h"
                value=""
                onChange={() => {}}
                error="Seleccione una hora válida"
                placeholder="HH:MM"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información técnica */}
      <Card>
        <CardHeader>
          <CardTitle>Información Técnica</CardTitle>
          <CardDescription>
            Detalles de implementación y comportamiento responsivo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Comportamiento Responsivo</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>
                  • <strong>Desktop:</strong> Usa Popover para el selector de
                  tiempo
                </li>
                <li>
                  • <strong>Mobile:</strong> Usa Sheet (drawer) desde la parte
                  inferior
                </li>
                <li>
                  • <strong>Detección automática:</strong> Basada en el hook
                  useMobile
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Validación</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>
                  • <strong>Tiempo real:</strong> Validación mientras el usuario
                  escribe
                </li>
                <li>
                  • <strong>Esquemas Zod:</strong> Integración completa con
                  react-hook-form
                </li>
                <li>
                  • <strong>Mensajes personalizados:</strong> Soporte para
                  errores externos
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Interacción</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>
                  • <strong>Máscara automática:</strong> Formato HH:MM aplicado
                  automáticamente
                </li>
                <li>
                  • <strong>Selector numérico:</strong> Botones para horas y
                  minutos
                </li>
                <li>
                  • <strong>Toggle AM/PM:</strong> Solo visible en formato 12h
                </li>
                <li>
                  • <strong>Activación por ícono:</strong> Selector se abre solo
                  al hacer clic en el reloj
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
