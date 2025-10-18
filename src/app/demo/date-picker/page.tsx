'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { DatePicker } from '@/components/ui/date-picker'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'

// Esquema de validación para React Hook Form
const DateFormSchema = z
  .object({
    required_date: z
      .date()
      .nullable()
      .refine((date) => date !== null, {
        message: 'La fecha es requerida',
      }),
    optional_date: z.date().optional().nullable(),
    datetime_field: z
      .date()
      .nullable()
      .refine((date) => date !== null, {
        message: 'La fecha y hora son requeridas',
      }),
    future_date: z
      .date()
      .nullable()
      .refine((date) => !date || date > new Date(), {
        message: 'La fecha debe ser futura',
      }),
    date_range_start: z
      .date()
      .nullable()
      .refine((date) => date !== null, {
        message: 'La fecha de inicio es requerida',
      }),
    date_range_end: z
      .date()
      .nullable()
      .refine((date) => date !== null, {
        message: 'La fecha de fin es requerida',
      }),
  })
  .refine(
    (data) => {
      // Validar que date_range_end sea posterior a date_range_start
      if (data.date_range_start && data.date_range_end) {
        return data.date_range_end > data.date_range_start
      }
      return true
    },
    {
      message: 'La fecha de fin debe ser posterior a la fecha de inicio',
      path: ['date_range_end'],
    }
  )

type DateFormData = z.infer<typeof DateFormSchema>

export default function DatePickerDemo() {
  const [basicDate, setBasicDate] = useState<Date | undefined>()
  const [dateWithTime, setDateWithTime] = useState<Date | undefined>()
  const [disabledDate, setDisabledDate] = useState<Date | undefined>()
  const [dateWithError, setDateWithError] = useState<Date | undefined>()
  const [showError, setShowError] = useState(false)

  // Nuevos estados para ejemplos con tiempo
  const [dateTime12h, setDateTime12h] = useState<Date | undefined>()
  const [dateTime24h, setDateTime24h] = useState<Date | undefined>()
  const [dateTimePreFilled, setDateTimePreFilled] = useState<Date | undefined>(
    new Date('2024-12-25T14:30:00.000Z')
  )
  const [dateTimeRestricted, setDateTimeRestricted] = useState<
    Date | undefined
  >()

  // Form para ejemplos con React Hook Form
  const form = useForm<DateFormData>({
    resolver: zodResolver(DateFormSchema),
    defaultValues: {
      required_date: null,
      optional_date: null,
      datetime_field: null,
      future_date: null,
      date_range_start: null,
      date_range_end: null,
    },
  })

  const handleErrorToggle = () => {
    setShowError(!showError)
  }

  const clearAllDates = () => {
    setBasicDate(undefined)
    setDateWithTime(undefined)
    setDisabledDate(undefined)
    setDateWithError(undefined)
    setDateTime12h(undefined)
    setDateTime24h(undefined)
    setDateTimePreFilled(new Date('2024-12-25T14:30:00.000Z'))
    setDateTimeRestricted(undefined)
    setShowError(false)
    form.reset()
  }

  const onSubmit = (data: DateFormData) => {
    console.log('Datos del formulario:', data)
    alert(
      'Formulario enviado correctamente. Revisa la consola para ver los datos.'
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">DatePicker Component Demo</h1>
        <p className="text-muted-foreground">
          Componente reutilizable para selección de fechas con entrada manual y
          calendario visual integrado. Incluye soporte para TimePicker.
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <Button onClick={clearAllDates} variant="outline">
          Limpiar todas las fechas
        </Button>
        <Button onClick={handleErrorToggle} variant="outline">
          {showError ? 'Ocultar' : 'Mostrar'} error
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Date Picker */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              DatePicker Básico
              <Badge variant="secondary">Solo fecha</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DatePicker value={basicDate} onChange={setBasicDate} />
            <div className="text-sm text-muted-foreground">
              <strong>Valor:</strong>{' '}
              {basicDate ? basicDate.toISOString() : 'No seleccionado'}
            </div>
            <div className="text-xs text-muted-foreground">
              Permite entrada manual con formato DD/MM/YYYY o selección visual
              mediante calendario.
            </div>
          </CardContent>
        </Card>

        {/* DatePicker con TimePicker 12h */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              DatePicker + TimePicker (12h)
              <Badge variant="default">Fecha + Hora</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DatePicker
              value={dateTime12h}
              onChange={setDateTime12h}
              hasTime={true}
              timeFormat="12h"
            />
            <div className="text-sm text-muted-foreground">
              <strong>Valor:</strong>{' '}
              {dateTime12h ? dateTime12h.toISOString() : 'No seleccionado'}
            </div>
            <div className="text-xs text-muted-foreground">
              Combina selección de fecha con TimePicker en formato 12 horas
              (AM/PM).
            </div>
          </CardContent>
        </Card>

        {/* DatePicker con TimePicker 24h */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              DatePicker + TimePicker (24h)
              <Badge variant="default">Fecha + Hora</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DatePicker
              value={dateTime24h}
              onChange={setDateTime24h}
              hasTime={true}
              timeFormat="24h"
            />
            <div className="text-sm text-muted-foreground">
              <strong>Valor:</strong>{' '}
              {dateTime24h ? dateTime24h.toISOString() : 'No seleccionado'}
            </div>
            <div className="text-xs text-muted-foreground">
              Combina selección de fecha con TimePicker en formato 24 horas.
            </div>
          </CardContent>
        </Card>

        {/* DatePicker con TimePicker Pre-rellenado */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              DatePicker + TimePicker Pre-rellenado
              <Badge variant="secondary">Valor inicial</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DatePicker
              value={dateTimePreFilled}
              onChange={setDateTimePreFilled}
              hasTime={true}
              timeFormat="12h"
            />
            <div className="text-sm text-muted-foreground">
              <strong>Valor:</strong>{' '}
              {dateTimePreFilled
                ? dateTimePreFilled.toISOString()
                : 'No seleccionado'}
            </div>
            <div className="text-xs text-muted-foreground">
              Ejemplo con fecha y hora pre-seleccionadas (25/12/2024 14:30).
            </div>
          </CardContent>
        </Card>

        {/* Date Picker with Restrictions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              DatePicker con Restricciones
              <Badge variant="secondary">minDate/maxDate</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DatePicker
              value={disabledDate}
              onChange={setDisabledDate}
              minDate={new Date()}
              maxDate={new Date(2025, 11, 31)}
            />
            <div className="text-sm text-muted-foreground">
              <strong>Valor:</strong>{' '}
              {disabledDate ? disabledDate.toISOString() : 'No seleccionado'}
            </div>
            <div className="text-xs text-muted-foreground">
              Fechas mínima: hoy, máxima: 31/12/2025. Fechas pasadas
              deshabilitadas.
            </div>
          </CardContent>
        </Card>

        {/* DatePicker con TimePicker y Restricciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              DatePicker + TimePicker con Restricciones
              <Badge variant="destructive">Fecha + Hora + Límites</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DatePicker
              value={dateTimeRestricted}
              onChange={setDateTimeRestricted}
              hasTime={true}
              timeFormat="24h"
              minDate={new Date()}
              maxDate={new Date(2025, 5, 30)} // Junio 2025
            />
            <div className="text-sm text-muted-foreground">
              <strong>Valor:</strong>{' '}
              {dateTimeRestricted
                ? dateTimeRestricted.toISOString()
                : 'No seleccionado'}
            </div>
            <div className="text-xs text-muted-foreground">
              Combina fecha + hora con restricciones (hoy hasta 30/06/2025).
            </div>
          </CardContent>
        </Card>

        {/* Date Picker with Error */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              DatePicker con Error
              <Badge variant="destructive">Estado de error</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DatePicker
              value={dateWithError}
              onChange={setDateWithError}
              required={true}
              error={showError}
              errorMessage={showError ? 'Este campo es obligatorio' : undefined}
            />
            <div className="text-sm text-muted-foreground">
              <strong>Valor:</strong>{' '}
              {dateWithError ? dateWithError.toISOString() : 'No seleccionado'}
            </div>
            <div className="text-xs text-muted-foreground">
              Muestra estados de error con estilos visuales y mensajes de
              validación.
            </div>
          </CardContent>
        </Card>

        {/* Disabled Date Picker */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              DatePicker Deshabilitado
              <Badge variant="outline">disabled=true</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DatePicker
              value={new Date('2024-12-25T10:30:00.000Z')}
              disabled={true}
            />
            <div className="text-sm text-muted-foreground">
              <strong>Valor:</strong> 2024-12-25T10:30:00.000Z (fijo)
            </div>
            <div className="text-xs text-muted-foreground">
              Estado deshabilitado con opacidad reducida y cursor not-allowed.
            </div>
          </CardContent>
        </Card>

        {/* Date Picker without Today Button */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Sin Botón "Hoy"
              <Badge variant="outline">showTodayButton=false</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DatePicker
              value={dateWithTime}
              onChange={setDateWithTime}
              showTodayButton={false}
            />
            <div className="text-sm text-muted-foreground">
              <strong>Valor:</strong>{' '}
              {dateWithTime ? dateWithTime.toISOString() : 'No seleccionado'}
            </div>
            <div className="text-xs text-muted-foreground">
              Calendario sin el botón "Hoy" para selección rápida.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* React Hook Form Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            DatePicker con React Hook Form
            <Badge variant="default">RHF + Zod</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Fecha Requerida */}
                <Field>
                  <FieldLabel htmlFor="required_date">
                    Fecha Requerida *
                  </FieldLabel>
                  <FieldContent>
                    <DatePicker
                      value={form.watch('required_date') || undefined}
                      onChange={(date) =>
                        form.setValue('required_date', date || null)
                      }
                    />
                    <FieldError
                      errors={[form.formState.errors.required_date]}
                    />
                  </FieldContent>
                </Field>

                {/* Fecha Opcional */}
                <Field>
                  <FieldLabel htmlFor="optional_date">
                    Fecha Opcional
                  </FieldLabel>
                  <FieldContent>
                    <DatePicker
                      value={form.watch('optional_date') || undefined}
                      onChange={(date) =>
                        form.setValue('optional_date', date || null)
                      }
                    />
                    <FieldError
                      errors={[form.formState.errors.optional_date]}
                    />
                  </FieldContent>
                </Field>

                {/* Fecha con Tiempo */}
                <Field>
                  <FieldLabel htmlFor="datetime_field">
                    Fecha y Hora *
                  </FieldLabel>
                  <FieldContent>
                    <DatePicker
                      value={form.watch('datetime_field') || undefined}
                      onChange={(date) =>
                        form.setValue('datetime_field', date || null)
                      }
                      hasTime={true}
                      timeFormat="12h"
                    />
                    <FieldError
                      errors={[form.formState.errors.datetime_field]}
                    />
                  </FieldContent>
                </Field>

                {/* Fecha Futura */}
                <Field>
                  <FieldLabel htmlFor="future_date">Fecha Futura *</FieldLabel>
                  <FieldContent>
                    <DatePicker
                      value={form.watch('future_date') || undefined}
                      onChange={(date) =>
                        form.setValue('future_date', date || null)
                      }
                      minDate={new Date()}
                    />
                    <FieldError errors={[form.formState.errors.future_date]} />
                  </FieldContent>
                </Field>

                {/* Rango de Fechas - Inicio */}
                <Field>
                  <FieldLabel htmlFor="date_range_start">
                    Fecha de Inicio *
                  </FieldLabel>
                  <FieldContent>
                    <DatePicker
                      value={form.watch('date_range_start') || undefined}
                      onChange={(date) =>
                        form.setValue('date_range_start', date || null)
                      }
                    />
                    <FieldError
                      errors={[form.formState.errors.date_range_start]}
                    />
                  </FieldContent>
                </Field>

                {/* Rango de Fechas - Fin */}
                <Field>
                  <FieldLabel htmlFor="date_range_end">
                    Fecha de Fin *
                  </FieldLabel>
                  <FieldContent>
                    <DatePicker
                      value={form.watch('date_range_end') || undefined}
                      onChange={(date) =>
                        form.setValue('date_range_end', date || null)
                      }
                      minDate={form.watch('date_range_start') || undefined}
                    />
                    <FieldError
                      errors={[form.formState.errors.date_range_end]}
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

              {/* Estado del Formulario */}
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

      {/* Features Section */}
      <Card>
        <CardHeader>
          <CardTitle>Características del Componente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-2">Funcionalidades</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Entrada manual con formato DD/MM/YYYY</li>
                <li>• Selección visual con calendario</li>
                <li>• Integración con TimePicker (12h/24h)</li>
                <li>• Validación automática de fechas</li>
                <li>• Soporte para fechas mínimas y máximas</li>
                <li>• Botón "Hoy" para selección rápida</li>
                <li>• Estados de error y validación</li>
                <li>• Soporte para disabled</li>
                <li>• Integración con InputGroup</li>
                <li>• Integración completa con React Hook Form</li>
                <li>• Validación con Zod</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Tecnologías</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• React + TypeScript</li>
                <li>• date-fns para manejo de fechas</li>
                <li>• Radix UI Popover</li>
                <li>• react-day-picker para calendario</li>
                <li>• TimePicker personalizado</li>
                <li>• Tailwind CSS para estilos</li>
                <li>• Zod para validación</li>
                <li>• React Hook Form para formularios</li>
                <li>• InputGroup para estructura</li>
                <li>• Lucide React para iconos</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
