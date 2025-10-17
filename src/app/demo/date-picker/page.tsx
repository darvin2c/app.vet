'use client'

import { useState } from 'react'
import { DatePicker } from '@/components/ui/date-picker'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function DatePickerDemo() {
  const [basicDate, setBasicDate] = useState<Date | undefined>()
  const [dateWithTime, setDateWithTime] = useState<Date | undefined>()
  const [disabledDate, setDisabledDate] = useState<Date | undefined>()
  const [dateWithError, setDateWithError] = useState<Date | undefined>()
  const [showError, setShowError] = useState(false)

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
          Componente reutilizable para selección de fechas con entrada manual y
          calendario visual integrado.
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
            />
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

        {/* Date Picker Pre-filled */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              DatePicker Pre-rellenado
              <Badge variant="secondary">Valor inicial</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DatePicker
              value={new Date('2024-12-20T14:30:00.000Z')}
              onChange={() => {}} // Read-only for demo
            />
            <div className="text-sm text-muted-foreground">
              <strong>Valor:</strong> 2024-12-20T14:30:00.000Z
            </div>
            <div className="text-xs text-muted-foreground">
              Ejemplo con fecha pre-seleccionada desde un valor ISO.
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
                <li>• Validación automática de fechas</li>
                <li>• Soporte para fechas mínimas y máximas</li>
                <li>• Botón "Hoy" para selección rápida</li>
                <li>• Estados de error y validación</li>
                <li>• Soporte para disabled</li>
                <li>• Integración con InputGroup</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Tecnologías</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• React + TypeScript</li>
                <li>• date-fns para manejo de fechas</li>
                <li>• Radix UI Popover</li>
                <li>• react-day-picker para calendario</li>
                <li>• Tailwind CSS para estilos</li>
                <li>• Zod para validación</li>
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
