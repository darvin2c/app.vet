'use client'

import * as React from 'react'
import { useState, useCallback } from 'react'
import { Clock, ClockIcon } from 'lucide-react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupInput,
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
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Toggle } from '@/components/ui/toggle'
import { useIsMobile } from '@/hooks/use-mobile'

// ============================================================================
// TIPOS BÁSICOS
// ============================================================================

export type TimeFormat = '12h' | '24h'
export type TimeValue = string

// Schema de validación para tiempo
const timeSchema = z.string().refine(
  (value) => {
    if (!value) return true // Permitir valores vacíos

    // Validar formato 24h (HH:MM)
    const time24hMatch = value.match(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/)
    if (time24hMatch) return true

    // Validar formato 12h (H:MM AM/PM o HH:MM AM/PM)
    const time12hMatch = value.match(
      /^(0?[1-9]|1[0-2]):([0-5][0-9])\s*(AM|PM)$/i
    )
    if (time12hMatch) return true

    return false
  },
  {
    message:
      'Formato de tiempo inválido. Use HH:MM para 24h o H:MM AM/PM para 12h',
  }
)

// ============================================================================
// UTILIDADES
// ============================================================================

// Generar array de horas según el formato
function getHoursArray(format: TimeFormat): number[] {
  if (format === '12h') {
    return Array.from({ length: 12 }, (_, i) => i + 1) // 1-12
  } else {
    return Array.from({ length: 24 }, (_, i) => i) // 0-23
  }
}

// Generar array de minutos
function getMinutesArray(): number[] {
  return Array.from({ length: 60 }, (_, i) => i) // 0-59
}

// Parsear tiempo desde string
function parseTimeString(
  timeString: string,
  format: TimeFormat
): {
  hours: number | null
  minutes: number | null
  period: 'AM' | 'PM' | null
} {
  if (!timeString) {
    return { hours: null, minutes: null, period: null }
  }

  if (format === '24h') {
    const match = timeString.match(/^(\d{1,2}):(\d{2})$/)
    if (match) {
      return {
        hours: parseInt(match[1], 10),
        minutes: parseInt(match[2], 10),
        period: null,
      }
    }
  } else {
    const match = timeString.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
    if (match) {
      return {
        hours: parseInt(match[1], 10),
        minutes: parseInt(match[2], 10),
        period: match[3].toUpperCase() as 'AM' | 'PM',
      }
    }
  }

  return { hours: null, minutes: null, period: null }
}

// Formatear tiempo a string
function formatTimeString(
  hours: number,
  minutes: number,
  period?: 'AM' | 'PM'
): string {
  const formattedMinutes = minutes.toString().padStart(2, '0')

  if (period) {
    return `${hours}:${formattedMinutes} ${period}`
  } else {
    const formattedHours = hours.toString().padStart(2, '0')
    return `${formattedHours}:${formattedMinutes}`
  }
}

// ============================================================================
// COMPONENTES INTERNOS
// ============================================================================

// Selector de horas
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
      <div className="text-sm font-medium text-center">Hora</div>
      <ScrollArea className="h-52">
        <div className="grid grid-cols-3 gap-1 p-1">
          {hours.map((hour) => (
            <Button
              key={hour}
              variant={selectedHour === hour.toString() ? 'default' : 'ghost'}
              size="sm"
              className="h-8 text-xs"
              onClick={() => onHourSelect(hour)}
            >
              {format === '24h' ? hour.toString().padStart(2, '0') : hour}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

// Selector de minutos
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
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-center">Minutos</div>
      <ScrollArea className="h-52">
        <div className="grid grid-cols-3 gap-1 p-1">
          {minutes.map((minute) => (
            <Button
              key={minute}
              variant={
                selectedMinute === minute.toString().padStart(2, '0')
                  ? 'default'
                  : 'ghost'
              }
              size="sm"
              className="h-8 text-xs"
              onClick={() => onMinuteSelect(minute)}
            >
              {minute.toString().padStart(2, '0')}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

// Selector de período (AM/PM)
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

// ============================================================================
// COMPONENTE PRINCIPAL DEL CONTENIDO
// ============================================================================

interface TimePickerContentProps {
  format: TimeFormat
  initialTime?: string
  onTimeSelect: (timeString: string) => void
  onClose?: () => void
}

function TimePickerContent({
  format,
  initialTime,
  onTimeSelect,
  onClose,
}: TimePickerContentProps) {
  const hoursArray = getHoursArray(format)
  const minutesArray = getMinutesArray()

  // Parsear tiempo inicial
  const parsedInitialTime = parseTimeString(initialTime || '', format)

  // Estado para rastrear qué ha seleccionado el usuario en esta sesión
  const [userSelections, setUserSelections] = useState<{
    hour: number | null
    minute: number | null
    period: 'AM' | 'PM' | null
  }>({
    hour: null,
    minute: null,
    period: null,
  })

  // Valores actuales (combinando inicial + selecciones del usuario)
  const currentHour = userSelections.hour ?? parsedInitialTime.hours
  const currentMinute = userSelections.minute ?? parsedInitialTime.minutes
  const currentPeriod = userSelections.period ?? parsedInitialTime.period

  // Handler para selección de hora
  const handleHourSelect = useCallback(
    (hour: number) => {
      setUserSelections((prev) => ({ ...prev, hour }))

      // Solo proceder si tenemos todos los valores necesarios
      if (
        userSelections.minute !== null &&
        (format === '24h' || userSelections.period !== null)
      ) {
        const timeString = formatTimeString(
          hour,
          userSelections.minute,
          userSelections.period || undefined
        )
        onTimeSelect(timeString)

        // Cerrar si la selección está completa
        if (format === '24h' || userSelections.period !== null) {
          onClose?.()
        }
      }
    },
    [userSelections, format, onTimeSelect, onClose]
  )

  // Handler para selección de minutos
  const handleMinuteSelect = useCallback(
    (minute: number) => {
      setUserSelections((prev) => ({ ...prev, minute }))

      // Solo proceder si tenemos todos los valores necesarios
      if (
        userSelections.hour !== null &&
        (format === '24h' || userSelections.period !== null)
      ) {
        const timeString = formatTimeString(
          userSelections.hour,
          minute,
          userSelections.period || undefined
        )
        onTimeSelect(timeString)

        // Cerrar si la selección está completa
        if (format === '24h' || userSelections.period !== null) {
          onClose?.()
        }
      }
    },
    [userSelections, format, onTimeSelect, onClose]
  )

  // Handler para selección de período
  const handlePeriodSelect = useCallback(
    (period: 'AM' | 'PM') => {
      setUserSelections((prev) => ({ ...prev, period }))

      // Solo proceder si tenemos todos los valores necesarios
      if (userSelections.hour !== null && userSelections.minute !== null) {
        const timeString = formatTimeString(
          userSelections.hour,
          userSelections.minute,
          period
        )
        onTimeSelect(timeString)
        onClose?.()
      }
    },
    [userSelections, onTimeSelect, onClose]
  )

  // Handler para "Ahora"
  const handleNowClick = useCallback(() => {
    const now = new Date()
    let hours = now.getHours()
    const minutes = now.getMinutes()
    let period: 'AM' | 'PM' | undefined

    if (format === '12h') {
      period = hours >= 12 ? 'PM' : 'AM'
      hours = hours % 12 || 12
    }

    const timeString = formatTimeString(hours, minutes, period)
    onTimeSelect(timeString)
    onClose?.()
  }, [format, onTimeSelect, onClose])

  return (
    <div className="space-y-4 p-4 min-w-md">
      <div className="grid grid-cols-2 gap-4">
        <HourSelector
          hours={hoursArray}
          selectedHour={currentHour?.toString() || ''}
          onHourSelect={handleHourSelect}
          format={format}
        />
        <MinuteSelector
          minutes={minutesArray}
          selectedMinute={
            currentMinute !== null
              ? currentMinute.toString().padStart(2, '0')
              : ''
          }
          onMinuteSelect={handleMinuteSelect}
        />
      </div>

      {format === '12h' && (
        <PeriodSelector
          selectedPeriod={currentPeriod || undefined}
          onPeriodSelect={handlePeriodSelect}
        />
      )}

      <div className="pt-2 border-t">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleNowClick}
        >
          <ClockIcon className="h-4 w-4 mr-2" />
          Ahora
        </Button>
      </div>
    </div>
  )
}

// ============================================================================
// COMPONENTE PRINCIPAL TIMEPICKER
// ============================================================================

export interface TimePickerProps {
  value?: TimeValue
  onChange?: (value: TimeValue) => void
  format?: TimeFormat
  placeholder?: string
  disabled?: boolean
  className?: string
  name?: string
  id?: string
}

export function TimePicker({
  value = '',
  onChange,
  format = '24h',
  placeholder = format === '12h' ? 'H:MM AM/PM' : 'HH:MM',
  disabled = false,
  className,
  name,
  id,
}: TimePickerProps) {
  const [open, setOpen] = useState(false)
  const isMobile = useIsMobile()

  const handleTimeSelect = useCallback(
    (timeString: string) => {
      onChange?.(timeString)
    },
    [onChange]
  )

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  // Handler para entrada manual
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      onChange?.(inputValue)
    },
    [onChange]
  )

  // Handler para abrir el picker solo con el icono
  const handleIconClick = useCallback(() => {
    if (!disabled) {
      setOpen(true)
    }
  }, [disabled])

  const content = (
    <TimePickerContent
      format={format}
      initialTime={value}
      onTimeSelect={handleTimeSelect}
      onClose={handleClose}
    />
  )

  // Componente del input para mobile
  const mobileInputComponent = (
    <InputGroup className={className}>
      <InputGroupInput
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={handleInputChange}
      />
      <InputGroupButton
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled}
        onClick={handleIconClick}
      >
        <Clock className="h-4 w-4" />
      </InputGroupButton>
    </InputGroup>
  )

  if (isMobile) {
    return (
      <>
        {mobileInputComponent}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="bottom" className="h-auto">
            <SheetHeader>
              <SheetTitle>Seleccionar Hora</SheetTitle>
            </SheetHeader>
            {content}
          </SheetContent>
        </Sheet>
      </>
    )
  }

  // Para desktop: separar input del trigger
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <InputGroup className={className}>
        <InputGroupInput
          id={id}
          name={name}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={handleInputChange}
        />
        <PopoverTrigger asChild>
          <InputGroupButton
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
          >
            <Clock className="h-4 w-4" />
          </InputGroupButton>
        </PopoverTrigger>
      </InputGroup>
      <PopoverContent className="w-auto p-0" align="start">
        {content}
      </PopoverContent>
    </Popover>
  )
}

export { timeSchema }
export default TimePicker
