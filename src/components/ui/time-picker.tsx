'use client'

import * as React from 'react'
import { useState, useCallback, useRef, useEffect } from 'react'
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

    // Validar formato 24h (HH:MM) - SOLO 2 dígitos para horas
    const time24hMatch = value.match(/^([01][0-9]|2[0-3]):([0-5][0-9])$/)
    if (time24hMatch) return true

    // Validar formato 12h (HH:MM AM/PM) - SOLO 2 dígitos para horas
    const time12hMatch = value.match(
      /^(0[1-9]|1[0-2]):([0-5][0-9])\s*(AM|PM)$/i
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
// UTILIDADES DE MÁSCARA Y FORMATEO
// ============================================================================

// Generar máscara visual basada en el formato
function getTimeMask(format: TimeFormat): string {
  return format === '24h' ? 'HH:MM' : 'HH:MM AM/PM'
}

// Aplicar máscara inteligente durante la escritura con validación en tiempo real
function applyTimeMask(input: string, format: TimeFormat): { 
  value: string; 
  cursorPosition: number;
  isComplete: boolean;
  isValid: boolean;
} {
  // Limpiar input de caracteres no válidos
  const cleanInput = input.replace(/[^\d\sAPMapm]/g, '').toUpperCase()
  
  let maskedValue = ''
  let cursorPosition = 0
  let isComplete = false
  let isValid = true
  
  // Procesar dígitos
  const digits = cleanInput.replace(/[^\d]/g, '')
  const hasAmPm = /[AP]M?/i.test(cleanInput)
  
  if (digits.length === 0) {
    return { value: '', cursorPosition: 0, isComplete: false, isValid: true }
  }
  
  // Validar y aplicar máscara según los dígitos ingresados
  if (digits.length >= 1) {
    const firstDigit = parseInt(digits[0])
    
    // Validar primer dígito de hora
    if (format === '24h' && firstDigit > 2) {
      isValid = false
    } else if (format === '12h' && firstDigit > 1) {
      isValid = false
    }
    
    // Para un solo dígito, agregarlo sin padding aún
    maskedValue += digits[0]
    cursorPosition = 1
  }
  
  if (digits.length >= 2) {
    const hour = parseInt(digits.slice(0, 2))
    
    // Validar hora completa
    if (format === '24h' && hour > 23) {
      isValid = false
    } else if (format === '12h' && (hour === 0 || hour > 12)) {
      isValid = false
    }
    
    // Siempre formatear con 2 dígitos y agregar dos puntos
    maskedValue = digits.slice(0, 2).padStart(2, '0') + ':'
    cursorPosition = 3
  }
  
  if (digits.length >= 3) {
    const firstMinuteDigit = parseInt(digits[2])
    
    // Validar primer dígito de minutos (máximo 5)
    if (firstMinuteDigit > 5) {
      isValid = false
    }
    
    maskedValue += digits[2]
    cursorPosition = 4
  }
  
  if (digits.length >= 4) {
    const minutes = parseInt(digits.slice(2, 4))
    
    // Validar minutos completos (máximo 59)
    if (minutes > 59) {
      isValid = false
    }
    
    maskedValue += digits[3]
    cursorPosition = 5
    
    // Para formato 12h, agregar espacio antes de AM/PM
    if (format === '12h') {
      maskedValue += ' '
      cursorPosition = 6
      
      // Detectar AM/PM del input original
      if (hasAmPm) {
        const amPmMatch = cleanInput.match(/[AP]M?/i)
        if (amPmMatch) {
          const period = amPmMatch[0].length === 1 ? amPmMatch[0] + 'M' : amPmMatch[0]
          maskedValue += period
          cursorPosition = maskedValue.length
          isComplete = true
        }
      }
    } else {
      isComplete = true
    }
  }
  
  return { value: maskedValue, cursorPosition, isComplete, isValid }
}

// Manejar patrones de entrada comunes
function handleCommonPatterns(input: string, format: TimeFormat): string {
  // Patrón: 1230 -> 12:30
  if (/^\d{4}$/.test(input)) {
    const hours = input.slice(0, 2)
    const minutes = input.slice(2, 4)
    return format === '12h' ? `${hours.padStart(2, '0')}:${minutes} ` : `${hours}:${minutes}`
  }
  
  // Patrón: 2p -> 02:00 PM (solo para 12h)
  if (format === '12h' && /^\d{1,2}[pP]$/i.test(input)) {
    const hour = input.slice(0, -1).padStart(2, '0')
    return `${hour}:00 PM`
  }
  
  // Patrón: 2a -> 02:00 AM (solo para 12h)
  if (format === '12h' && /^\d{1,2}[aA]$/i.test(input)) {
    const hour = input.slice(0, -1).padStart(2, '0')
    return `${hour}:00 AM`
  }
  
  return input
}

// Validar y formatear tiempo automáticamente
function validateAndFormatTime(
  inputValue: string,
  format: TimeFormat
): string | null {
  if (!inputValue.trim()) return null

  try {
    // Manejar patrones comunes primero
    const processedInput = handleCommonPatterns(inputValue.trim(), format)
    
    // Validar usando el schema existente
    timeSchema.parse(processedInput)

    // Si pasa la validación, formatear según el formato
    const parsed = parseTimeString(processedInput, format)
    
    if (parsed.hours !== null && parsed.minutes !== null) {
      if (format === '24h') {
        // Formatear a HH:MM
        return formatTimeString(parsed.hours, parsed.minutes)
      } else if (format === '12h' && parsed.period) {
        // Formatear a H:MM AM/PM
        return formatTimeString(parsed.hours, parsed.minutes, parsed.period)
      }
    }
    
    return null
  } catch {
    return null
  }
}

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
  const formattedHours = hours.toString().padStart(2, '0')

  if (period) {
    return `${formattedHours}:${formattedMinutes} ${period}`
  } else {
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
              {hour.toString().padStart(2, '0')}
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
  placeholder = format === '12h' ? 'HH:MM AM/PM' : 'HH:MM',
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

  const inputRef = useRef<HTMLInputElement>(null)

  // Handler inteligente para entrada manual con máscara y validación
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      const currentCursorPosition = e.target.selectionStart || 0
      
      // Aplicar máscara inteligente con validación
      const { value: maskedValue, cursorPosition, isComplete, isValid } = applyTimeMask(inputValue, format)
      
      // Solo actualizar si es válido o si estamos borrando
      if (isValid || maskedValue.length < (value?.length || 0)) {
        onChange?.(maskedValue)
        
        // Posicionar cursor después del próximo render
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(cursorPosition, cursorPosition)
          }
        }, 0)
        
        // Si está completo y válido, intentar formatear
        if (isComplete && isValid) {
          const formattedTime = validateAndFormatTime(maskedValue, format)
          if (formattedTime) {
            onChange?.(formattedTime)
          }
        }
      }
    },
    [onChange, format, value]
  )

  // Handler para teclas especiales (A/P para AM/PM, Backspace inteligente)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const currentValue = value || ''
      const cursorPosition = e.currentTarget.selectionStart || 0
      
      // Manejo de teclas A/P para AM/PM en formato 12h
      if (format === '12h' && (e.key.toLowerCase() === 'a' || e.key.toLowerCase() === 'p')) {
        e.preventDefault()
        
        // Si ya tenemos HH:MM, agregar AM/PM
        if (/^\d{2}:\d{2}/.test(currentValue)) {
          const period = e.key.toLowerCase() === 'a' ? 'AM' : 'PM'
          const newValue = currentValue.replace(/\s*(AM|PM)?$/i, ` ${period}`)
          onChange?.(newValue)
          return
        }
        
        // Si solo tenemos dígitos, completar con :00 AM/PM
        if (/^\d{1,2}$/.test(currentValue)) {
          const period = e.key.toLowerCase() === 'a' ? 'AM' : 'PM'
          const paddedHour = currentValue.padStart(2, '0')
          const newValue = `${paddedHour}:00 ${period}`
          onChange?.(newValue)
          return
        }
      }
      
      // Backspace inteligente - eliminar carácter por carácter preservando estructura
      if (e.key === 'Backspace') {
        e.preventDefault()
        
        if (cursorPosition > 0) {
          const charToDelete = currentValue[cursorPosition - 1]
          
          // Si es un separador (:, espacio), saltar al carácter anterior
          if (charToDelete === ':' || charToDelete === ' ') {
            const newPosition = Math.max(0, cursorPosition - 1)
            setTimeout(() => {
              if (inputRef.current) {
                inputRef.current.setSelectionRange(newPosition, newPosition)
              }
            }, 0)
            return
          }
          
          // Eliminar solo dígitos y letras (AM/PM)
          if (/[\dAPM]/i.test(charToDelete)) {
            const newValue = currentValue.slice(0, cursorPosition - 1) + currentValue.slice(cursorPosition)
            onChange?.(newValue)
            
            setTimeout(() => {
              if (inputRef.current) {
                const newPosition = Math.max(0, cursorPosition - 1)
                inputRef.current.setSelectionRange(newPosition, newPosition)
              }
            }, 0)
          }
        }
      }
      
      // Delete inteligente - eliminar carácter por carácter hacia adelante preservando estructura
      if (e.key === 'Delete') {
        e.preventDefault()
        
        if (cursorPosition < currentValue.length) {
          const charToDelete = currentValue[cursorPosition]
          
          // Si es un separador (:, espacio), saltar al siguiente carácter
          if (charToDelete === ':' || charToDelete === ' ') {
            const newPosition = Math.min(currentValue.length, cursorPosition + 1)
            setTimeout(() => {
              if (inputRef.current) {
                inputRef.current.setSelectionRange(newPosition, newPosition)
              }
            }, 0)
            return
          }
          
          // Eliminar solo dígitos y letras (AM/PM)
          if (/[\dAPM]/i.test(charToDelete)) {
            const newValue = currentValue.slice(0, cursorPosition) + currentValue.slice(cursorPosition + 1)
            onChange?.(newValue)
            
            setTimeout(() => {
              if (inputRef.current) {
                inputRef.current.setSelectionRange(cursorPosition, cursorPosition)
              }
            }, 0)
          }
        }
      }
    },
    [value, format, onChange]
  )

  // Handler para blur del input
  const handleInputBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const inputValue = e.target.value.trim()
      
      if (inputValue) {
        // Intentar validar y formatear cuando el usuario sale del campo
        const formattedTime = validateAndFormatTime(inputValue, format)
        
        if (formattedTime) {
          onChange?.(formattedTime)
        }
      }
    },
    [onChange, format]
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

  // Máscara visual basada en el formato
  const maskFormat = getTimeMask(format)

  // Componente unificado del input con máscara visual
  const inputComponent = (
    <InputGroup className={className}>
      <InputGroupInput
        ref={inputRef}
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleInputBlur}
        className="font-mono relative z-10 bg-transparent"
      />
      {/* Máscara visual mejorada */}
      <div
        className="absolute inset-0 flex items-center px-3 pointer-events-none font-mono text-sm z-0"
        aria-hidden="true"
      >
        {!value ? (
          // Mostrar máscara completa cuando no hay valor
          <span className="text-muted-foreground/30">
            {maskFormat}
          </span>
        ) : (
          // Mostrar máscara parcial cuando hay valor
          <div className="flex">
            {/* Parte invisible que coincide con el valor ingresado */}
            <span className="invisible select-none">
              {value}
            </span>
            {/* Parte visible de la máscara restante */}
            {value.length < maskFormat.length && (
              <span className="text-muted-foreground/30">
                {maskFormat.slice(value.length)}
              </span>
            )}
          </div>
        )}
      </div>
      {isMobile ? (
        <InputGroupButton
          type="button"
          variant="ghost"
          size="sm"
          disabled={disabled}
          onClick={handleIconClick}
        >
          <Clock className="h-4 w-4" />
        </InputGroupButton>
      ) : (
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
      )}
    </InputGroup>
  )

  if (isMobile) {
    return (
      <>
        {inputComponent}
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

  // Para desktop
  return (
    <Popover open={open} onOpenChange={setOpen}>
      {inputComponent}
      <PopoverContent className="w-auto p-0" align="start">
        {content}
      </PopoverContent>
    </Popover>
  )
}

export { timeSchema }
export default TimePicker
