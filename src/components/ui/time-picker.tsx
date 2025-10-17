'use client'

import * as React from 'react'
import { useState, useCallback, useMemo } from 'react'
import { Clock, ClockIcon } from 'lucide-react'
import { z } from 'zod'
import { format as formatDate } from 'date-fns'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from '@/components/ui/input-group'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Toggle } from '@/components/ui/toggle'
import { useIsMobile } from '@/hooks/use-mobile'

// ============================================================================
// SCHEMAS Y TIPOS
// ============================================================================

// Tipos de formato de tiempo
export type TimeFormat = '12h' | '24h'

// Esquema para formato 12 horas (HH:MM AM/PM)
export const time12hSchema = z
  .string()
  .regex(
    /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/,
    'Formato inválido. Use HH:MM AM/PM'
  )
  .refine((time) => {
    const [timePart, period] = time.split(' ')
    const [hours, minutes] = timePart.split(':').map(Number)

    // Validar horas (1-12)
    if (hours < 1 || hours > 12) return false

    // Validar minutos (0-59)
    if (minutes < 0 || minutes > 59) return false

    // Validar período
    if (!['AM', 'PM'].includes(period)) return false

    return true
  }, 'Hora inválida')

// Esquema para formato 24 horas (HH:MM)
export const time24hSchema = z
  .string()
  .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato inválido. Use HH:MM')
  .refine((time) => {
    const [hours, minutes] = time.split(':').map(Number)

    // Validar horas (0-23)
    if (hours < 0 || hours > 23) return false

    // Validar minutos (0-59)
    if (minutes < 0 || minutes > 59) return false

    return true
  }, 'Hora inválida')

// Función para obtener el esquema según el formato
export function getTimeSchema(format: TimeFormat) {
  return format === '12h' ? time12hSchema : time24hSchema
}

// Tipos derivados
export type Time12h = z.infer<typeof time12hSchema>
export type Time24h = z.infer<typeof time24hSchema>
export type TimeValue = Time12h | Time24h

// Interfaz para entrada de tiempo
export interface TimeInput {
  hours: string
  minutes: string
  period?: 'AM' | 'PM'
}

// ============================================================================
// UTILIDADES DE TIEMPO
// ============================================================================

// Interfaz para objeto de tiempo
export interface TimeObject {
  hours: number
  minutes: number
  period?: 'AM' | 'PM'
}

// Formatear TimeObject a string
export function formatTime(time: TimeObject, format: TimeFormat): string {
  const { hours, minutes, period } = time

  if (format === '12h') {
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
    const paddedMinutes = minutes.toString().padStart(2, '0')
    const timePeriod = period || (hours < 12 ? 'AM' : 'PM')
    return `${displayHours}:${paddedMinutes} ${timePeriod}`
  } else {
    const paddedHours = hours.toString().padStart(2, '0')
    const paddedMinutes = minutes.toString().padStart(2, '0')
    return `${paddedHours}:${paddedMinutes}`
  }
}

// Parsear string de tiempo a TimeObject
export function parseTime(
  timeString: string,
  format: TimeFormat
): TimeObject | null {
  try {
    if (format === '12h') {
      const match = timeString.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
      if (!match) return null

      const [, hoursStr, minutesStr, period] = match
      let hours = parseInt(hoursStr, 10)
      const minutes = parseInt(minutesStr, 10)

      if (period.toUpperCase() === 'PM' && hours !== 12) {
        hours += 12
      } else if (period.toUpperCase() === 'AM' && hours === 12) {
        hours = 0
      }

      return { hours, minutes, period: period.toUpperCase() as 'AM' | 'PM' }
    } else {
      const match = timeString.match(/^(\d{1,2}):(\d{2})$/)
      if (!match) return null

      const [, hoursStr, minutesStr] = match
      const hours = parseInt(hoursStr, 10)
      const minutes = parseInt(minutesStr, 10)

      return { hours, minutes }
    }
  } catch {
    return null
  }
}

// Aplicar máscara de tiempo a string de entrada
export function applyTimeMask(value: string, format: TimeFormat): string {
  // Remover caracteres no numéricos excepto espacios para formato 12h
  const cleanValue = value.replace(/[^\d\s]/g, '')

  if (format === '12h') {
    // Para formato 12h: HH:MM AM/PM
    if (cleanValue.length <= 2) {
      return cleanValue
    } else if (cleanValue.length <= 4) {
      return `${cleanValue.slice(0, 2)}:${cleanValue.slice(2)}`
    } else {
      return `${cleanValue.slice(0, 2)}:${cleanValue.slice(2, 4)}`
    }
  } else {
    // Para formato 24h: HH:MM
    if (cleanValue.length <= 2) {
      return cleanValue
    } else {
      return `${cleanValue.slice(0, 2)}:${cleanValue.slice(2, 4)}`
    }
  }
}

// Convertir de 24h a 12h
export function convertTo12HourFormat(time24h: string): string {
  const [hoursStr, minutesStr] = time24h.split(':')
  const hours = parseInt(hoursStr, 10)
  const minutes = parseInt(minutesStr, 10)

  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
  const period = hours < 12 ? 'AM' : 'PM'
  const paddedMinutes = minutes.toString().padStart(2, '0')

  return `${displayHours}:${paddedMinutes} ${period}`
}

// Convertir de 12h a 24h
export function convertTo24HourFormat(time12h: string): string {
  const match = time12h.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) return time12h

  const [, hoursStr, minutesStr, period] = match
  let hours = parseInt(hoursStr, 10)
  const minutes = parseInt(minutesStr, 10)

  if (period.toUpperCase() === 'PM' && hours !== 12) {
    hours += 12
  } else if (period.toUpperCase() === 'AM' && hours === 12) {
    hours = 0
  }

  const paddedHours = hours.toString().padStart(2, '0')
  const paddedMinutes = minutes.toString().padStart(2, '0')

  return `${paddedHours}:${paddedMinutes}`
}

// Generar array de horas
export function getHoursArray(format: TimeFormat): number[] {
  if (format === '12h') {
    return Array.from({ length: 12 }, (_, i) => i + 1)
  } else {
    return Array.from({ length: 24 }, (_, i) => i)
  }
}

// Generar array de minutos
export function getMinutesArray(): number[] {
  return Array.from({ length: 60 }, (_, i) => i)
}

// Validar hora
export function isValidHour(hour: number, format: TimeFormat): boolean {
  if (format === '12h') {
    return hour >= 1 && hour <= 12
  } else {
    return hour >= 0 && hour <= 23
  }
}

// Validar minuto
export function isValidMinute(minute: number): boolean {
  return minute >= 0 && minute <= 59
}

// ============================================================================
// HOOK USE-TIME-PICKER
// ============================================================================

export interface UseTimePickerProps {
  format: TimeFormat
  value?: string
  onChange?: (value: string) => void
  onError?: (error: string | null) => void
  disabled?: boolean
}

export interface UseTimePickerReturn {
  // Estado
  inputValue: string
  isOpen: boolean
  error: string | null

  // Tiempo actual
  currentTime: TimeInput

  // Acciones
  setInputValue: (value: string) => void
  setIsOpen: (open: boolean) => void
  handleTimeSelect: (
    hours: number,
    minutes: number,
    period?: 'AM' | 'PM'
  ) => void
  handleHourChange: (hour: number) => void
  handleMinuteChange: (minute: number) => void
  handlePeriodChange: (period: 'AM' | 'PM') => void
  clearError: () => void
  resetTime: () => void

  // Propiedades computadas
  showAmPm: boolean
  maxHour: number
  minHour: number
  hoursArray: number[]
  minutesArray: number[]
}

export function useTimePicker({
  format,
  value = '',
  onChange,
  onError,
  disabled = false,
}: UseTimePickerProps): UseTimePickerReturn {
  const [inputValue, setInputValueState] = useState(value)
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSelectedHour, setHasSelectedHour] = useState(false)
  const [hasSelectedMinute, setHasSelectedMinute] = useState(false)

  // Propiedades computadas
  const showAmPm = format === '12h'
  const maxHour = format === '12h' ? 12 : 23
  const minHour = format === '12h' ? 1 : 0
  const hoursArray = getHoursArray(format)
  const minutesArray = getMinutesArray()

  // Parsear tiempo actual
  const currentTime = useMemo((): TimeInput => {
    // Si el input está vacío, no mostrar ninguna selección
    if (!inputValue.trim()) {
      return {
        hours: '',
        minutes: '',
        period: format === '12h' ? undefined : undefined,
      }
    }

    const parsed = parseTime(inputValue, format)
    if (parsed) {
      if (format === '12h') {
        const displayHours =
          parsed.hours === 0
            ? 12
            : parsed.hours > 12
              ? parsed.hours - 12
              : parsed.hours
        return {
          hours: displayHours.toString(),
          minutes: parsed.minutes.toString().padStart(2, '0'),
          period: parsed.period,
        }
      } else {
        return {
          hours: parsed.hours.toString(),
          minutes: parsed.minutes.toString().padStart(2, '0'),
        }
      }
    }

    // Si no se puede parsear pero hay contenido, mantener valores vacíos
    return {
      hours: '',
      minutes: '',
      period: format === '12h' ? undefined : undefined,
    }
  }, [inputValue, format])

  // Actualizar valor de entrada
  const setInputValue = useCallback(
    (newValue: string) => {
      if (disabled) return

      // Aplicar máscara
      const maskedValue = applyTimeMask(newValue, format)
      setInputValueState(maskedValue)

      // Validar y notificar cambios
      const parsed = parseTime(maskedValue, format)
      if (parsed) {
        const formattedTime = formatTime(parsed, format)
        onChange?.(formattedTime)
        setError(null)
        onError?.(null)
      } else if (maskedValue.length > 0) {
        setError('Formato de hora inválido')
        onError?.('Formato de hora inválido')
      } else {
        setError(null)
        onError?.(null)
      }
    },
    [disabled, format, onChange, onError]
  )

  // Manejar selección de tiempo completo
  const handleTimeSelect = useCallback(
    (hours: number, minutes: number, period?: 'AM' | 'PM') => {
      if (disabled) return

      // Validar entrada
      if (!isValidHour(hours, format) || !isValidMinute(minutes)) {
        setError('Hora o minuto inválido')
        onError?.('Hora o minuto inválido')
        return
      }

      // Convertir a formato 24h para procesamiento interno
      let actualHours = hours
      if (format === '12h' && period) {
        if (period === 'PM' && hours !== 12) {
          actualHours = hours + 12
        } else if (period === 'AM' && hours === 12) {
          actualHours = 0
        }
      }

      const timeObject = { hours: actualHours, minutes, period }
      const formattedTime = formatTime(timeObject, format)

      setInputValueState(formattedTime)
      onChange?.(formattedTime)
      setError(null)
      onError?.(null)
      setIsOpen(false)
    },
    [disabled, format, onChange, onError]
  )

  // Manejar cambio de hora
  const handleHourChange = useCallback(
    (hour: number) => {
      if (disabled) return

      setHasSelectedHour(true)
      const minutes = parseInt(currentTime.minutes, 10) || 0
      const period = currentTime.period

      // Crear el tiempo con la nueva hora
      let actualHours = hour
      if (format === '12h' && period) {
        if (period === 'PM' && hour !== 12) {
          actualHours = hour + 12
        } else if (period === 'AM' && hour === 12) {
          actualHours = 0
        }
      }

      const timeObject = { hours: actualHours, minutes, period }
      const formattedTime = formatTime(timeObject, format)

      setInputValueState(formattedTime)
      onChange?.(formattedTime)
      setError(null)
      onError?.(null)

      // Cerrar si ya se seleccionaron hora y minuto
      /*if (hasSelectedMinute) {
        setIsOpen(false)
        setHasSelectedHour(false)
        setHasSelectedMinute(false)
      }*/
    },
    [
      disabled,
      currentTime.minutes,
      currentTime.period,
      format,
      onChange,
      onError,
      hasSelectedMinute,
    ]
  )

  // Manejar cambio de minuto
  const handleMinuteChange = useCallback(
    (minute: number) => {
      if (disabled) return

      setHasSelectedMinute(true)
      const hours =
        parseInt(currentTime.hours, 10) || (format === '12h' ? 12 : 0)
      const period = currentTime.period

      // Crear el tiempo con el nuevo minuto
      let actualHours = hours
      if (format === '12h' && period) {
        if (period === 'PM' && hours !== 12) {
          actualHours = hours + 12
        } else if (period === 'AM' && hours === 12) {
          actualHours = 0
        }
      }

      const timeObject = { hours: actualHours, minutes: minute, period }
      const formattedTime = formatTime(timeObject, format)

      setInputValueState(formattedTime)
      onChange?.(formattedTime)
      setError(null)
      onError?.(null)

      // Cerrar si ya se seleccionaron hora y minuto
      /*if (hasSelectedHour) {
        setIsOpen(false)
        setHasSelectedHour(false)
        setHasSelectedMinute(false)
      }*/
    },
    [
      disabled,
      currentTime.hours,
      currentTime.period,
      format,
      onChange,
      onError,
      hasSelectedHour,
    ]
  )

  // Manejar cambio de período (AM/PM)
  const handlePeriodChange = useCallback(
    (period: 'AM' | 'PM') => {
      if (disabled || format !== '12h') return

      const hours = parseInt(currentTime.hours, 10) || 12
      const minutes = parseInt(currentTime.minutes, 10) || 0
      handleTimeSelect(hours, minutes, period)
    },
    [disabled, format, currentTime.hours, currentTime.minutes, handleTimeSelect]
  )

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null)
    onError?.(null)
  }, [onError])

  // Resetear tiempo
  const resetTime = useCallback(() => {
    if (disabled) return

    setInputValueState('')
    onChange?.('')
    setError(null)
    onError?.(null)
    setIsOpen(false)
    setHasSelectedHour(false)
    setHasSelectedMinute(false)
  }, [disabled, onChange, onError])

  return {
    // Estado
    inputValue,
    isOpen,
    error,

    // Tiempo actual
    currentTime,

    // Acciones
    setInputValue,
    setIsOpen,
    handleTimeSelect,
    handleHourChange,
    handleMinuteChange,
    handlePeriodChange,
    clearError,
    resetTime,

    // Propiedades computadas
    showAmPm,
    maxHour,
    minHour,
    hoursArray,
    minutesArray,
  }
}

// ============================================================================
// COMPONENTES
// ============================================================================

interface TimePickerProps extends Omit<UseTimePickerProps, 'format'> {
  format: TimeFormat
  placeholder?: string
  className?: string
  inputClassName?: string
  triggerClassName?: string
  contentClassName?: string
  error?: string
  id?: string
  name?: string
}

// Componente selector de horas
interface HourSelectorProps {
  hours: number[]
  selectedHour: string
  onHourSelect: (hour: number) => void
  format: TimeFormat
}

function HourSelector({
  hours,
  selectedHour,
  onHourSelect,
  format,
}: HourSelectorProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Hora</h4>
      <ScrollArea className="h-32">
        <div className="grid grid-cols-4 gap-1 p-1">
          {hours.map((hour) => {
            const displayHour =
              format === '24h'
                ? hour.toString().padStart(2, '0')
                : hour.toString()
            const isSelected =
              selectedHour === hour.toString() ||
              (format === '24h' &&
                selectedHour === hour.toString().padStart(2, '0'))

            return (
              <Button
                key={hour}
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                className="h-8 w-full"
                onClick={() => onHourSelect(hour)}
              >
                {displayHour}
              </Button>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}

// Componente selector de minutos
interface MinuteSelectorProps {
  minutes: number[]
  selectedMinute: string
  onMinuteSelect: (minute: number) => void
}

function MinuteSelector({
  minutes,
  selectedMinute,
  onMinuteSelect,
}: MinuteSelectorProps) {
  // Mostrar solo minutos en intervalos de 5 para mejor UX
  const displayMinutes = minutes.filter((m) => m % 5 === 0)

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Minuto</h4>
      <ScrollArea className="h-32">
        <div className="grid grid-cols-4 gap-1 p-1">
          {displayMinutes.map((minute) => {
            const displayMinute = minute.toString().padStart(2, '0')
            const isSelected =
              selectedMinute === minute.toString().padStart(2, '0')

            return (
              <Button
                key={minute}
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                className="h-8 w-full"
                onClick={() => onMinuteSelect(minute)}
              >
                {displayMinute}
              </Button>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}

// Componente selector de período (AM/PM)
interface PeriodSelectorProps {
  selectedPeriod?: 'AM' | 'PM'
  onPeriodSelect: (period: 'AM' | 'PM') => void
}

function PeriodSelector({
  selectedPeriod,
  onPeriodSelect,
}: PeriodSelectorProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Período</h4>
      <div className="flex gap-2">
        <Toggle
          pressed={selectedPeriod === 'AM'}
          onPressedChange={() => onPeriodSelect('AM')}
          className="flex-1"
        >
          AM
        </Toggle>
        <Toggle
          pressed={selectedPeriod === 'PM'}
          onPressedChange={() => onPeriodSelect('PM')}
          className="flex-1"
        >
          PM
        </Toggle>
      </div>
    </div>
  )
}

// Contenido del selector de tiempo
interface TimePickerContentProps {
  timePicker: UseTimePickerReturn
  format: TimeFormat
  onClose?: () => void
}

function TimePickerContent({
  timePicker,
  format,
  onClose,
}: TimePickerContentProps) {
  const {
    currentTime,
    hoursArray,
    minutesArray,
    showAmPm,
    handleHourChange,
    handleMinuteChange,
    handlePeriodChange,
    handleTimeSelect,
  } = timePicker

  // Función para establecer la hora actual dentro del picker
  const handleSetCurrentTime = useCallback(() => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()

    if (format === '12h') {
      const displayHour =
        currentHour === 0
          ? 12
          : currentHour > 12
            ? currentHour - 12
            : currentHour
      const period = currentHour >= 12 ? 'PM' : 'AM'
      handleTimeSelect(displayHour, currentMinute, period)
    } else {
      handleTimeSelect(currentHour, currentMinute)
    }

    // Cerrar el picker después de establecer la hora
    onClose?.()
  }, [format, handleTimeSelect, onClose])

  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-2 gap-4">
        <HourSelector
          hours={hoursArray}
          selectedHour={currentTime.hours}
          onHourSelect={handleHourChange}
          format={format}
        />
        <MinuteSelector
          minutes={minutesArray}
          selectedMinute={currentTime.minutes}
          onMinuteSelect={handleMinuteChange}
        />
      </div>

      {showAmPm && (
        <PeriodSelector
          selectedPeriod={currentTime.period}
          onPeriodSelect={handlePeriodChange}
        />
      )}

      {/* Botón para establecer hora actual */}
      <div className="pt-2 border-t">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleSetCurrentTime}
        >
          <ClockIcon className="h-4 w-4 mr-2" />
          Ahora
        </Button>
      </div>
    </div>
  )
}

export function TimePicker({
  format,
  placeholder,
  className,
  inputClassName,
  triggerClassName,
  contentClassName,
  error,
  id,
  name,
  ...timePickerProps
}: TimePickerProps) {
  const isMobile = useIsMobile()
  const timePicker = useTimePicker({ format, ...timePickerProps })

  const {
    inputValue,
    isOpen,
    error: internalError,
    setInputValue,
    setIsOpen,
  } = timePicker

  const displayError = error || internalError
  const displayPlaceholder =
    placeholder || (format === '12h' ? 'HH:MM AM/PM' : 'HH:MM')

  // Input con ícono de reloj
  const TimeInput = (
    <div className={className}>
      <InputGroup
        className={cn(
          displayError && 'border-red-500 focus-within:ring-red-500'
        )}
      >
        <InputGroupInput
          id={id}
          name={name}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={displayPlaceholder}
          className={inputClassName}
          disabled={timePickerProps.disabled}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              'h-full px-2 py-2 hover:bg-transparent',
              triggerClassName
            )}
            onClick={() => !timePickerProps.disabled && setIsOpen(!isOpen)}
            disabled={timePickerProps.disabled}
            title="Abrir selector de tiempo"
          >
            <Clock className="h-4 w-4" />
            <span className="sr-only">Abrir selector de tiempo</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      {displayError && (
        <p className="mt-1 text-sm text-red-600">{displayError}</p>
      )}
    </div>
  )

  // Contenido del selector
  const SelectorContent = (
    <TimePickerContent
      timePicker={timePicker}
      format={format}
      onClose={() => setIsOpen(false)}
    />
  )

  // Renderizado responsivo
  if (isMobile) {
    return (
      <Sheet
        open={isOpen && !timePickerProps.disabled}
        onOpenChange={(open) => !timePickerProps.disabled && setIsOpen(open)}
      >
        <SheetTrigger asChild>{TimeInput}</SheetTrigger>
        <SheetContent side="bottom" className={cn('h-auto', contentClassName)}>
          <SheetHeader>
            <SheetTitle>
              Seleccionar Tiempo {format === '12h' ? '(12h)' : '(24h)'}
            </SheetTitle>
          </SheetHeader>
          {SelectorContent}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Popover
      open={isOpen && !timePickerProps.disabled}
      onOpenChange={(open) => !timePickerProps.disabled && setIsOpen(open)}
    >
      <PopoverTrigger asChild>{TimeInput}</PopoverTrigger>
      <PopoverContent
        className={cn('w-auto p-0', contentClassName)}
        align="start"
      >
        {SelectorContent}
      </PopoverContent>
    </Popover>
  )
}
