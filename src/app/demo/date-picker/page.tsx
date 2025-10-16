'use client'

import { useState } from 'react'
import { DatePicker, DateDisplay } from '@/components/ui/date-picker'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function DatePickerDemo() {
  const [basicDate, setBasicDate] = useState<string | undefined>()
  const [dateWithTime, setDateWithTime] = useState<string | undefined>()
  const [disabledDate, setDisabledDate] = useState<string | undefined>()
  const [dateWithError, setDateWithError] = useState<string | undefined>()
  const [showError, setShowError] = useState(false)

  // Disabled dates (weekends for example)
  const disabledDates = [
    new Date(2024, 11, 21), // Saturday
    new Date(2024, 11, 22), // Sunday
    new Date(2024, 11, 28), // Saturday
    new Date(2024, 11, 29), // Sunday
  ]

  const handleErrorToggle = () => {
    setShowError(!showError)
  }

  const clearAllDates = () => {
    setBasicDate(undefined)
    setDateWithTime(undefined)
    setDisabledDate(undefined)
    setDateWithError(undefined)
    setShowError(false)
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">DatePicker Component Demo</h1>
        <p className="text-muted-foreground">
          Componente reutilizable para selección de fechas con máscara de
          entrada y soporte opcional para hora.
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
            <DatePicker
              value={basicDate}
              onChange={setBasicDate}
              placeholder="Seleccionar fecha"
            />
            <div className="text-sm text-muted-foreground">
              <strong>Valor:</strong> {basicDate || 'No seleccionado'}
            </div>
            <div className="text-xs text-muted-foreground">
              Permite entrada manual con máscara DD/MM/YYYY o selección visual
              mediante calendario.
            </div>
          </CardContent>
        </Card>

        {/* Date Picker with Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              DatePicker con Hora
              <Badge variant="secondary">hasTime=true</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DatePicker
              value={dateWithTime}
              onChange={setDateWithTime}
              placeholder="Seleccionar fecha y hora"
              hasTime={true}
            />
            <div className="text-sm text-muted-foreground">
              <strong>Valor:</strong> {dateWithTime || 'No seleccionado'}
            </div>
            <div className="text-xs text-muted-foreground">
              Incluye selectores de hora (00-23) y minutos (00-59) cuando
              hasTime está habilitado.
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
              placeholder="Solo días laborables"
              minDate={new Date()}
              maxDate={new Date(2025, 0, 31)}
              disabledDates={disabledDates}
            />
            <div className="text-sm text-muted-foreground">
              <strong>Valor:</strong> {disabledDate || 'No seleccionado'}
            </div>
            <div className="text-xs text-muted-foreground">
              Fechas mínima: hoy, máxima: 31/01/2025. Fines de semana
              deshabilitados.
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
              placeholder="Fecha requerida"
              required={true}
              error={showError ? 'Este campo es obligatorio' : undefined}
            />
            <div className="text-sm text-muted-foreground">
              <strong>Valor:</strong> {dateWithError || 'No seleccionado'}
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
              value="2024-12-25T10:30:00.000Z"
              placeholder="Campo deshabilitado"
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

        {/* Date Picker with Time (Pre-filled) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              DatePicker Pre-rellenado
              <Badge variant="secondary">Valor inicial</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DatePicker
              value="2024-12-20T14:30:00.000Z"
              onChange={() => {}} // Read-only for demo
              placeholder="Fecha pre-seleccionada"
              hasTime={true}
            />
            <div className="text-sm text-muted-foreground">
              <strong>Valor:</strong> 2024-12-20T14:30:00.000Z
            </div>
            <div className="text-xs text-muted-foreground">
              Ejemplo con fecha y hora pre-seleccionadas desde un valor ISO.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DateDisplay Component Examples */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">DateDisplay Component Examples</h2>
          <p className="text-muted-foreground">
            Componente para mostrar fechas de forma elegante y legible.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic DateDisplay - No date */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                DateDisplay Básico
                <Badge variant="outline">Sin fecha</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/50">
                <DateDisplay placeholder="No hay fecha seleccionada" />
              </div>
              <div className="text-xs text-muted-foreground">
                <strong>Código:</strong>
                <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-x-auto">
                  {`<DateDisplay placeholder="No hay fecha seleccionada" />`}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* DateDisplay with date only */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                DateDisplay con Fecha
                <Badge variant="secondary">Solo fecha</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/50">
                <DateDisplay date={new Date('2024-12-20T10:30:00')} />
              </div>
              <div className="text-xs text-muted-foreground">
                <strong>Código:</strong>
                <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-x-auto">
                  {`<DateDisplay date={new Date('2024-12-20T10:30:00')} />`}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* DateDisplay with date and time */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                DateDisplay con Fecha y Hora
                <Badge variant="secondary">hasTime=true</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/50">
                <DateDisplay
                  date={new Date('2024-12-20T14:30:00')}
                  hasTime={true}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                <strong>Código:</strong>
                <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-x-auto">
                  {`<DateDisplay 
  date={new Date('2024-12-20T14:30:00')} 
  hasTime={true} 
/>`}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* DateDisplay with custom styling */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                DateDisplay con Estilos
                <Badge variant="outline">className</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-4 border rounded-lg bg-muted/50">
                  <DateDisplay
                    date={new Date('2024-12-25T09:00:00')}
                    hasTime={true}
                    className="text-lg font-bold text-primary"
                  />
                </div>
                <div className="p-4 border rounded-lg bg-muted/50">
                  <DateDisplay
                    date={new Date('2024-12-25T09:00:00')}
                    className="text-sm text-muted-foreground"
                  />
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                <strong>Código:</strong>
                <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-x-auto">
                  {`<DateDisplay 
  date={new Date('2024-12-25T09:00:00')} 
  hasTime={true}
  className="text-lg font-bold text-primary"
/>

<DateDisplay 
  date={new Date('2024-12-25T09:00:00')} 
  className="text-sm text-muted-foreground"
/>`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive DateDisplay Examples */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              DateDisplay Interactivo
              <Badge variant="secondary">Actualización en tiempo real</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium">Fecha básica seleccionada:</h4>
                <div className="p-4 border rounded-lg bg-muted/50">
                  <DateDisplay
                    date={basicDate ? new Date(basicDate) : undefined}
                    placeholder="Selecciona una fecha arriba"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Fecha con hora seleccionada:</h4>
                <div className="p-4 border rounded-lg bg-muted/50">
                  <DateDisplay
                    date={dateWithTime ? new Date(dateWithTime) : undefined}
                    hasTime={true}
                    placeholder="Selecciona fecha y hora arriba"
                  />
                </div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              <strong>Nota:</strong> Estos DateDisplay se actualizan
              automáticamente cuando seleccionas fechas en los DatePickers de
              arriba.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>API del Componente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">DatePicker Props</h4>
              <div className="grid gap-2 text-sm">
                <div>
                  <code className="bg-muted px-2 py-1 rounded">value</code>:{' '}
                  string | undefined - Valor en formato ISO
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded">onChange</code>:{' '}
                  (value: string | undefined) =&gt; void
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded">hasTime</code>:{' '}
                  boolean - Habilita selección de hora
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded">minDate</code>:{' '}
                  Date - Fecha mínima seleccionable
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded">maxDate</code>:{' '}
                  Date - Fecha máxima seleccionable
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded">
                    disabledDates
                  </code>
                  : Date[] - Array de fechas deshabilitadas
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">DateDisplay Props</h4>
              <div className="grid gap-2 text-sm">
                <div>
                  <code className="bg-muted px-2 py-1 rounded">date</code>: Date
                  | undefined - Fecha a mostrar
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded">hasTime</code>:{' '}
                  boolean - Mostrar hora además de fecha
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded">
                    placeholder
                  </code>
                  : string - Texto cuando no hay fecha
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded">className</code>:{' '}
                  string - Clases CSS adicionales
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Características</h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Máscara automática DD/MM/YYYY en entrada manual</li>
                <li>Validación en tiempo real de fechas</li>
                <li>Navegación por teclado (Tab, Enter, Escape)</li>
                <li>Soporte completo de accesibilidad (ARIA)</li>
                <li>Integración con react-hook-form y zod</li>
                <li>Responsive (popover en desktop)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
