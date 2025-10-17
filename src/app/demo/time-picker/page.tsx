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
import { TimePicker } from '@/components/ui/time-picker'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

// Esquemas simplificados para formularios
const appointmentSchema = z.object({
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  reminderTime: z.string().optional(),
})

const scheduleSchema = z.object({
  openTime: z.string().optional(),
  closeTime: z.string().optional(),
  lunchStart: z.string().optional(),
  lunchEnd: z.string().optional(),
})

type AppointmentForm = z.infer<typeof appointmentSchema>
type ScheduleForm = z.infer<typeof scheduleSchema>

export default function TimePickerDemo() {
  // Estados para ejemplos básicos
  const [time12h, setTime12h] = useState('')
  const [time24h, setTime24h] = useState('')
  const [timeDisabled, setTimeDisabled] = useState('14:30')
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

  const onAppointmentSubmit = (data: AppointmentForm) => {
    toast.success('Cita programada correctamente', {
      description: `Inicio: ${data.startTime}, Fin: ${data.endTime}`,
    })
  }

  const onScheduleSubmit = (data: ScheduleForm) => {
    toast.success('Horario configurado correctamente', {
      description: `Apertura: ${data.openTime}, Cierre: ${data.closeTime}`,
    })
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">TimePicker Component</h1>
        <p className="text-muted-foreground">
          Componente simplificado para selección de tiempo con soporte para formatos 12h y 24h
        </p>
      </div>

      {/* Funcionalidades */}
      <Card>
        <CardHeader>
          <CardTitle>Funcionalidades</CardTitle>
          <CardDescription>
            Características principales del componente TimePicker
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Badge variant="secondary">Formato 12h</Badge>
              <p className="text-sm text-muted-foreground">
                Soporte para formato de 12 horas con AM/PM
              </p>
            </div>
            <div className="space-y-2">
              <Badge variant="secondary">Formato 24h</Badge>
              <p className="text-sm text-muted-foreground">
                Soporte para formato de 24 horas
              </p>
            </div>
            <div className="space-y-2">
              <Badge variant="secondary">Responsivo</Badge>
              <p className="text-sm text-muted-foreground">
                Popover en desktop, Sheet en mobile
              </p>
            </div>
            <div className="space-y-2">
              <Badge variant="secondary">Selectores visuales</Badge>
              <p className="text-sm text-muted-foreground">
                Selectores de hora, minuto y período
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ejemplos básicos */}
      <Card>
        <CardHeader>
          <CardTitle>Ejemplos Básicos</CardTitle>
          <CardDescription>
            Diferentes configuraciones del TimePicker
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Formato 12 horas</label>
              <TimePicker
                format="12h"
                value={time12h}
                onChange={(value) => setTime12h(value || '')}
              />
              {time12h && (
                <p className="text-sm text-muted-foreground">
                  Valor seleccionado: {time12h}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Formato 24 horas</label>
              <TimePicker
                format="24h"
                value={time24h}
                onChange={(value) => setTime24h(value || '')}
              />
              {time24h && (
                <p className="text-sm text-muted-foreground">
                  Valor seleccionado: {time24h}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Deshabilitado</label>
              <TimePicker
                format="24h"
                value={timeDisabled}
                onChange={(value) => setTimeDisabled(value || '')}
                disabled
              />
              <p className="text-sm text-muted-foreground">
                Campo deshabilitado con valor predeterminado
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Ejemplo Interactivo
              </label>
              <TimePicker
                format="24h"
                value={timeWithError}
                onChange={(value) => setTimeWithError(value || '')}
              />
              <p className="text-sm text-muted-foreground">
                Componente simplificado sin validación
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulario de citas */}
      <Card>
        <CardHeader>
          <CardTitle>Formulario de Citas</CardTitle>
          <CardDescription>
            Ejemplo de uso en formularios con react-hook-form
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...appointmentForm}>
            <form
              onSubmit={appointmentForm.handleSubmit(onAppointmentSubmit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={appointmentForm.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora de inicio</FormLabel>
                      <FormControl>
                        <TimePicker
                          format="12h"
                          value={field.value || ''}
                          onChange={field.onChange}
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
                      <FormLabel>Hora de fin</FormLabel>
                      <FormControl>
                        <TimePicker
                          format="12h"
                          value={field.value || ''}
                          onChange={field.onChange}
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
                    <FormLabel>Recordatorio</FormLabel>
                    <FormControl>
                      <TimePicker
                        format="24h"
                        value={field.value || ''}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Programar Cita</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Formulario de horarios */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Horarios</CardTitle>
          <CardDescription>
            Ejemplo de configuración de horarios de trabajo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...scheduleForm}>
            <form
              onSubmit={scheduleForm.handleSubmit(onScheduleSubmit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={scheduleForm.control}
                  name="openTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora de apertura</FormLabel>
                      <FormControl>
                        <TimePicker
                          format="24h"
                          value={field.value || ''}
                          onChange={field.onChange}
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
                      <FormLabel>Hora de cierre</FormLabel>
                      <FormControl>
                        <TimePicker
                          format="24h"
                          value={field.value || ''}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={scheduleForm.control}
                  name="lunchStart"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inicio de almuerzo</FormLabel>
                      <FormControl>
                        <TimePicker
                          format="12h"
                          value={field.value || ''}
                          onChange={field.onChange}
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
                      <FormLabel>Fin de almuerzo</FormLabel>
                      <FormControl>
                        <TimePicker
                          format="12h"
                          value={field.value || ''}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit">Guardar Horarios</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Estados de validación */}
      <Card>
        <CardHeader>
          <CardTitle>Estados Simplificados</CardTitle>
          <CardDescription>
            El componente ahora es de solo visualización sin validación interna
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Formato 12h</label>
              <TimePicker
                format="12h"
                value="2:30 PM"
                onChange={() => {}}
              />
              <p className="text-sm text-green-600">✓ Valor predeterminado</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Formato 24h</label>
              <TimePicker
                format="24h"
                value="14:30"
                onChange={() => {}}
              />
              <p className="text-sm text-green-600">✓ Valor predeterminado</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información técnica */}
      <Card>
        <CardHeader>
          <CardTitle>Información Técnica</CardTitle>
          <CardDescription>
            Detalles de implementación del componente simplificado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Props principales:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>
                  <code>format</code>: '12h' | '24h' - Formato de tiempo
                </li>
                <li>
                  <code>value</code>: string - Valor actual del tiempo
                </li>
                <li>
                  <code>onChange</code>: (value: string) =&gt; void - Callback de cambio
                </li>
                <li>
                  <code>disabled</code>: boolean - Estado deshabilitado
                </li>

                <li>
                  <code>className</code>: string - Clases CSS adicionales
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Características:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Componente de solo visualización sin validación interna</li>
                <li>Selectores visuales para hora, minuto y período (AM/PM)</li>
                <li>Responsivo: Popover en desktop, Sheet en mobile</li>
                <li>Botón "Ahora" para establecer la hora actual</li>
                <li>Minutos en intervalos de 5 para mejor UX</li>
                <li>Integración simple con react-hook-form</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
