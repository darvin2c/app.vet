'use client'

import * as React from 'react'
import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { Calendar as CalendarIcon, Clock } from 'lucide-react'
import { format, parse, isValid } from 'date-fns'
import { es } from 'date-fns/locale'
import { z } from 'zod'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
  SheetFooter,
} from '@/components/ui/sheet'
import { useIsMobile } from '@/hooks/use-mobile'
import { Separator } from './separator'
import TimePicker from './time-picker'

// Schema de validación para fechas
const dateSchema = z.string().refine(
  (value) => {
    if (!value) return true // Permitir valores vacíos
    const parsedDate = parse(value, 'dd/MM/yyyy', new Date())
    return isValid(parsedDate)
  },
  {
    message: 'Formato de fecha inválido. Use dd/mm/yyyy',
  }
)

// Función para combinar fecha y hora
function combineDateTime(date: Date, timeString: string): Date {
  if (!timeString || timeString.trim() === '') {
    // Si no hay hora, crear fecha con 00:00:00 explícitamente (fecha sin hora específica)
    const combined = new Date(date)
    combined.setHours(0, 0, 0, 0)
    return combined
  }

  // Parsear la hora del string
  let hours = 0
  let minutes = 0

  // Formato 24h (HH:MM)
  const time24hMatch = timeString.match(/^(\d{1,2}):(\d{2})$/)
  if (time24hMatch) {
    hours = parseInt(time24hMatch[1], 10)
    minutes = parseInt(time24hMatch[2], 10)
  } else {
    // Formato 12h (H:MM AM/PM)
    const time12hMatch = timeString.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
    if (time12hMatch) {
      hours = parseInt(time12hMatch[1], 10)
      minutes = parseInt(time12hMatch[2], 10)
      const period = time12hMatch[3].toUpperCase()

      if (period === 'PM' && hours !== 12) {
        hours += 12
      } else if (period === 'AM' && hours === 12) {
        hours = 0
      }
    }
  }

  // Crear nueva fecha con la hora combinada
  const combined = new Date(date)
  combined.setHours(hours, minutes, 0, 0)
  return combined
}

// Función para extraer hora de una fecha
function extractTimeFromDate(
  date: Date,
  format: '12h' | '24h' = '24h'
): string {
  const hours = date.getHours()
  const minutes = date.getMinutes()

  if (format === '12h') {
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
  } else {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }
}

export interface DatePickerProps {
  /**
   * Valor de la fecha en formato ISO string o Date
   */
  value?: Date | string
  /**
   * Callback cuando cambia la fecha
   */
  onChange?: (date: Date | undefined) => void
  /**
   * Si el componente está deshabilitado
   */
  disabled?: boolean
  /**
   * Si hay error en la validación
   */
  error?: boolean
  /**
   * Mensaje de error
   */
  errorMessage?: string
  /**
   * Clase CSS adicional
   */
  className?: string
  /**
   * Fecha mínima seleccionable
   */
  minDate?: Date
  /**
   * Fecha máxima seleccionable
   */
  maxDate?: Date
  /**
   * Si se debe mostrar el botón "Hoy"
   */
  showTodayButton?: boolean
  /**
   * Formato de fecha para mostrar (por defecto dd/MM/yyyy)
   */
  dateFormat?: string
  /**
   * ID del input
   */
  id?: string
  /**
   * Nombre del input
   */
  name?: string
  /**
   * Si el campo es requerido
   */
  required?: boolean
  /**
   * Si incluye selector de tiempo (para compatibilidad)
   */
  hasTime?: boolean
  timeFormat?: '12h' | '24h'
}

/**
 * Componente DatePicker que combina InputGroup y Calendar
 * Permite entrada manual de fecha y selección visual con calendario
 */
export function DatePicker({
  value,
  onChange,
  disabled = false,
  error = false,
  errorMessage,
  className,
  minDate,
  maxDate,
  showTodayButton = true,
  dateFormat = 'dd/MM/yyyy',
  id,
  name,
  required = false,
  hasTime, // Prop para compatibilidad, no se usa
  timeFormat = '12h',
  ...props
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [timeValue, setTimeValue] = useState('')
  const [inputError, setInputError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const inputRef = useRef<HTMLInputElement>(null)
  const isMobile = useIsMobile()

  // Bandera para controlar si el usuario está editando activamente la hora
  const isUserEditingTime = useRef(false)
  const timeEditTimeout = useRef<NodeJS.Timeout | null>(null)

  // Convertir value a Date si es string
  const dateValue = useMemo(() => {
    if (!value) return undefined
    if (value instanceof Date) return value
    if (typeof value === 'string') {
      const parsed = new Date(value)
      return isValid(parsed) ? parsed : undefined
    }
    return undefined
  }, [value])

  // Sincronizar inputValue con dateValue
  useEffect(() => {
    if (dateValue) {
      setInputValue(format(dateValue, dateFormat))
      // Si hasTime está habilitado, solo extraer la hora si NO es 00:00:00 Y el usuario NO está editando
      if (hasTime && !isUserEditingTime.current) {
        const hours = dateValue.getHours()
        const minutes = dateValue.getMinutes()
        const seconds = dateValue.getSeconds()

        // Solo mostrar la hora si es diferente de 00:00:00 (fecha sin hora específica)
        if (hours !== 0 || minutes !== 0 || seconds !== 0) {
          setTimeValue(extractTimeFromDate(dateValue, timeFormat))
        } else {
          setTimeValue('')
        }
      }
    } else {
      setInputValue('')
      if (hasTime && !isUserEditingTime.current) {
        setTimeValue('')
      }
    }
  }, [dateValue, dateFormat, hasTime, timeFormat])

  // Validar entrada manual
  const validateInput = useCallback(
    (inputVal: string) => {
      if (!inputVal.trim()) {
        setInputError(null)
        return null
      }

      try {
        dateSchema.parse(inputVal)
        const parsedDate = parse(inputVal, dateFormat, new Date())

        if (!isValid(parsedDate)) {
          setInputError('Fecha inválida')
          return null
        }

        // Validar rango de fechas
        if (minDate && parsedDate < minDate) {
          setInputError(
            `La fecha debe ser posterior a ${format(minDate, dateFormat)}`
          )
          return null
        }

        if (maxDate && parsedDate > maxDate) {
          setInputError(
            `La fecha debe ser anterior a ${format(maxDate, dateFormat)}`
          )
          return null
        }

        setInputError(null)
        return parsedDate
      } catch (err) {
        setInputError('Formato de fecha inválido')
        return null
      }
    },
    [dateFormat, minDate, maxDate]
  )

  // Función para aplicar máscara de fecha DD/MM/YYYY
  const applyDateMask = useCallback((value: string) => {
    // Remover todo lo que no sea número
    const numbersOnly = value.replace(/\D/g, '')

    // Aplicar máscara progresivamente
    let masked = ''
    for (let i = 0; i < numbersOnly.length && i < 8; i++) {
      if (i === 2 || i === 4) {
        masked += '/'
      }
      masked += numbersOnly[i]
    }

    return masked
  }, [])

  // Validar día y mes mientras se escribe
  const validatePartialDate = useCallback((value: string) => {
    const parts = value.split('/')

    // Validar día (01-31)
    if (parts[0] && parts[0].length === 2) {
      const day = parseInt(parts[0], 10)
      if (day < 1 || day > 31) {
        return 'Día debe estar entre 01 y 31'
      }
    }

    // Validar mes (01-12)
    if (parts[1] && parts[1].length === 2) {
      const month = parseInt(parts[1], 10)
      if (month < 1 || month > 12) {
        return 'Mes debe estar entre 01 y 12'
      }
    }

    return null
  }, [])

  // Manejar cambio en el input
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value

      // Aplicar máscara
      const maskedValue = applyDateMask(rawValue)
      setInputValue(maskedValue)

      if (!maskedValue.trim()) {
        setInputError(null)
        onChange?.(undefined)
        return
      }

      // Validar formato parcial mientras se escribe
      const partialError = validatePartialDate(maskedValue)
      if (partialError) {
        setInputError(partialError)
        return
      }

      // Validar solo si el input tiene el formato completo
      if (maskedValue.length === dateFormat.length) {
        const validatedDate = validateInput(maskedValue)
        if (validatedDate) {
          // Si hasTime está habilitado, combinar con la hora actual
          if (hasTime && timeValue) {
            const combinedDateTime = combineDateTime(validatedDate, timeValue)
            onChange?.(combinedDateTime)
          } else {
            onChange?.(validatedDate)
          }
        }
      } else {
        // Limpiar error si está escribiendo
        setInputError(null)
      }
    },
    [
      applyDateMask,
      validatePartialDate,
      dateFormat.length,
      validateInput,
      onChange,
      hasTime,
      timeValue,
    ]
  )

  // Manejar blur del input
  const handleInputBlur = useCallback(() => {
    if (inputValue.trim()) {
      const validatedDate = validateInput(inputValue)
      if (validatedDate) {
        // Si hasTime está habilitado, combinar con la hora actual
        if (hasTime && timeValue) {
          const combinedDateTime = combineDateTime(validatedDate, timeValue)
          onChange?.(combinedDateTime)
        } else {
          onChange?.(validatedDate)
        }
      }
    }
  }, [inputValue, validateInput, onChange, hasTime, timeValue])

  // Manejar selección desde el calendario
  const handleCalendarSelect = useCallback(
    (selectedDate: Date | undefined) => {
      if (selectedDate) {
        setSelectedDate(selectedDate)
        if (!isMobile) {
          // En desktop, aplicar inmediatamente
          setInputValue(format(selectedDate, dateFormat))
          setInputError(null)

          // Si hasTime está habilitado y hay hora, combinar; sino solo fecha
          if (hasTime && timeValue && timeValue.trim() !== '') {
            const combinedDateTime = combineDateTime(selectedDate, timeValue)
            onChange?.(combinedDateTime)
          } else {
            onChange?.(selectedDate)
          }
          setOpen(false)
        }
      }
    },
    [dateFormat, onChange, isMobile, hasTime, timeValue]
  )

  // Manejar botón "Hoy"
  const handleTodayClick = useCallback(() => {
    const today = new Date()
    setSelectedDate(today)
    if (!isMobile) {
      // En desktop, aplicar inmediatamente
      setInputValue(format(today, dateFormat))
      setInputError(null)

      // Si hasTime está habilitado y hay hora, combinar; sino solo fecha
      if (hasTime && timeValue && timeValue.trim() !== '') {
        const combinedDateTime = combineDateTime(today, timeValue)
        onChange?.(combinedDateTime)
      } else {
        onChange?.(today)
      }
      setOpen(false)
    }
  }, [dateFormat, onChange, isMobile, hasTime, timeValue])

  // Manejar confirmación en mobile
  const handleConfirm = useCallback(() => {
    if (selectedDate) {
      setInputValue(format(selectedDate, dateFormat))
      setInputError(null)

      // Si hasTime está habilitado y hay hora, combinar; sino solo fecha
      if (hasTime && timeValue && timeValue.trim() !== '') {
        const combinedDateTime = combineDateTime(selectedDate, timeValue)
        onChange?.(combinedDateTime)
      } else {
        onChange?.(selectedDate)
      }
    }
    setOpen(false)
  }, [selectedDate, dateFormat, onChange, hasTime, timeValue])

  // Manejar cancelación en mobile
  const handleCancel = useCallback(() => {
    setSelectedDate(dateValue)
    setOpen(false)
  }, [dateValue])

  // Manejar click en el botón del calendario
  const handleCalendarButtonClick = useCallback(() => {
    if (disabled) return
    // Inicializar selectedDate con el valor actual al abrir
    setSelectedDate(dateValue)
    setOpen(!open)
  }, [disabled, open, dateValue])

  // Limpiar fecha
  const handleClear = useCallback(() => {
    setInputValue('')
    setInputError(null)
    onChange?.(undefined)
  }, [onChange])

  // Determinar si hay error
  const hasError = error || !!inputError || !!errorMessage

  // Componente de calendario reutilizable
  const CalendarComponent = () => (
    <div className="flex flex-col items-center gap-2">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleCalendarSelect}
        disabled={(date) => {
          if (minDate && date < minDate) return true
          if (maxDate && date > maxDate) return true
          return false
        }}
        locale={es}
        className={cn('w-full', isMobile && 'max-w-sm')}
      />
      <Separator />
      {showTodayButton && (
        <div className="flex justify-center pb-3 px-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleTodayClick}
            className="w-full sm:w-auto min-w-sm"
          >
            Hoy
          </Button>
        </div>
      )}
    </div>
  )

  // Máscara visual basada en dateFormat
  const maskFormat = dateFormat.toUpperCase()

  const inputGroupContent = hasTime ? (
    // Cuando hasTime es true, renderizar como componentes separados en flex container
    <div className="flex gap-2">
      <InputGroup
        className={cn(
          'flex-1',
          hasError && 'border-destructive ring-destructive/20',
          disabled && 'opacity-50'
        )}
        data-disabled={disabled}
      >
        <InputGroupInput
          ref={inputRef}
          id={id}
          name={name}
          type="text"
          placeholder={maskFormat}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          disabled={disabled}
          required={required}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
          className={cn(
            'font-mono relative z-10 bg-transparent',
            hasError && 'text-destructive placeholder:text-destructive/50'
          )}
          {...props}
        />
        {/* Máscara visual por detrás */}
        <div
          className="absolute inset-0 flex items-center px-3 pointer-events-none text-muted-foreground/40 font-mono text-sm z-0"
          aria-hidden="true"
        >
          {inputValue.length < maskFormat.length && (
            <span>
              {inputValue}
              <span className="text-muted-foreground/30">
                {maskFormat.slice(inputValue.length)}
              </span>
            </span>
          )}
        </div>

        <InputGroupAddon align="inline-end">
          {isMobile ? (
            <InputGroupButton
              type="button"
              variant="ghost"
              size="icon-xs"
              disabled={disabled}
              onClick={handleCalendarButtonClick}
              title="Abrir calendario"
              aria-label="Abrir calendario"
            >
              <CalendarIcon className="h-4 w-4" />
            </InputGroupButton>
          ) : (
            <PopoverTrigger asChild>
              <InputGroupButton
                type="button"
                variant="ghost"
                size="icon-xs"
                disabled={disabled}
                onClick={handleCalendarButtonClick}
                title="Abrir calendario"
                aria-label="Abrir calendario"
              >
                <CalendarIcon className="h-4 w-4" />
              </InputGroupButton>
            </PopoverTrigger>
          )}
        </InputGroupAddon>
        {/* TimePicker dentro de un InputGroupAddon */}
        <InputGroupAddon
          align="inline-end"
          className=" !pr-0"
          onClick={(e) => {
            // Prevenir el comportamiento de foco automático cuando se hace clic en el TimePicker
            // El TimePicker debe manejar su propio foco
            e.stopPropagation()
          }}
        >
          <TimePicker
            format={timeFormat}
            value={timeValue}
            className="max-w-32 border-0 "
            disabled={disabled}
            onChange={(value) => {
              const newTimeValue = value || ''

              // Marcar que el usuario está editando activamente
              isUserEditingTime.current = true

              // Limpiar timeout anterior si existe
              if (timeEditTimeout.current) {
                clearTimeout(timeEditTimeout.current)
              }

              // Establecer timeout para marcar que terminó la edición
              timeEditTimeout.current = setTimeout(() => {
                isUserEditingTime.current = false
              }, 500) // 500ms después de la última edición

              setTimeValue(newTimeValue)

              // Solo combinar si hay una fecha válida y el valor realmente cambió
              if (
                hasTime &&
                onChange &&
                dateValue &&
                newTimeValue !== timeValue
              ) {
                const combinedDateTime = combineDateTime(
                  dateValue,
                  newTimeValue
                )
                onChange(combinedDateTime)
              }
            }}
          />
        </InputGroupAddon>
      </InputGroup>
    </div>
  ) : (
    // Cuando hasTime es false, renderizar como InputGroup normal
    <InputGroup
      className={cn(
        hasError && 'border-destructive ring-destructive/20',
        disabled && 'opacity-50'
      )}
      data-disabled={disabled}
    >
      <InputGroupInput
        ref={inputRef}
        id={id}
        name={name}
        type="text"
        placeholder={maskFormat}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        disabled={disabled}
        required={required}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
        className={cn(
          'font-mono relative z-10 bg-transparent',
          hasError && 'text-destructive placeholder:text-destructive/50'
        )}
        {...props}
      />
      {/* Máscara visual por detrás */}
      <div
        className="absolute inset-0 flex items-center px-3 pointer-events-none text-muted-foreground/40 font-mono text-sm z-0"
        aria-hidden="true"
      >
        {inputValue.length < maskFormat.length && (
          <span>
            {inputValue}
            <span className="text-muted-foreground/30">
              {maskFormat.slice(inputValue.length)}
            </span>
          </span>
        )}
      </div>

      <InputGroupAddon align="inline-end">
        {isMobile ? (
          <InputGroupButton
            type="button"
            variant="ghost"
            size="icon-xs"
            disabled={disabled}
            onClick={handleCalendarButtonClick}
            title="Abrir calendario"
            aria-label="Abrir calendario"
          >
            <CalendarIcon className="h-4 w-4" />
          </InputGroupButton>
        ) : (
          <PopoverTrigger asChild>
            <InputGroupButton
              type="button"
              variant="ghost"
              size="icon-xs"
              disabled={disabled}
              onClick={handleCalendarButtonClick}
              title="Abrir calendario"
              aria-label="Abrir calendario"
            >
              <CalendarIcon className="h-4 w-4" />
            </InputGroupButton>
          </PopoverTrigger>
        )}
      </InputGroupAddon>
    </InputGroup>
  )

  return (
    <div className={cn('relative', className)}>
      {/* InputGroup común para mobile y desktop */}
      {isMobile ? (
        inputGroupContent
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          {inputGroupContent}
          <PopoverContent className="w-auto p-0" align="end">
            <CalendarComponent />
          </PopoverContent>
        </Popover>
      )}

      {/* Sheet para mobile */}
      {isMobile && (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="bottom" className="h-auto max-h-[80vh]">
            <SheetHeader>
              <SheetTitle>Seleccionar fecha</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <CalendarComponent />
            </div>
            <SheetFooter className="flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="button" onClick={handleConfirm} className="flex-1">
                Confirmar
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}

export default DatePicker
