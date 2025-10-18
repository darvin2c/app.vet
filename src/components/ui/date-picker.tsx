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
    } else {
      setInputValue('')
    }
  }, [dateValue, dateFormat])

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
          onChange?.(validatedDate)
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
    ]
  )

  // Manejar blur del input
  const handleInputBlur = useCallback(() => {
    if (inputValue.trim()) {
      const validatedDate = validateInput(inputValue)
      if (validatedDate) {
        onChange?.(validatedDate)
      }
    }
  }, [inputValue, validateInput, onChange])

  // Manejar selección desde el calendario
  const handleCalendarSelect = useCallback(
    (selectedDate: Date | undefined) => {
      if (selectedDate) {
        setSelectedDate(selectedDate)
        if (!isMobile) {
          // En desktop, aplicar inmediatamente
          setInputValue(format(selectedDate, dateFormat))
          setInputError(null)
          onChange?.(selectedDate)
          setOpen(false)
        }
      }
    },
    [dateFormat, onChange, isMobile]
  )

  // Manejar botón "Hoy"
  const handleTodayClick = useCallback(() => {
    const today = new Date()
    setSelectedDate(today)
    if (!isMobile) {
      // En desktop, aplicar inmediatamente
      setInputValue(format(today, dateFormat))
      setInputError(null)
      onChange?.(today)
      setOpen(false)
    }
  }, [dateFormat, onChange, isMobile])

  // Manejar confirmación en mobile
  const handleConfirm = useCallback(() => {
    if (selectedDate) {
      setInputValue(format(selectedDate, dateFormat))
      setInputError(null)
      onChange?.(selectedDate)
    }
    setOpen(false)
  }, [selectedDate, dateFormat, onChange])

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
    <div className="flex flex-col gap-2">
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
        className={cn('w-full', isMobile && 'max-w-none')}
      />
      <Separator />
      {showTodayButton && (
        <div className="flex justify-center pb-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleTodayClick}
            className="w-full sm:w-auto"
          >
            Hoy
          </Button>
        </div>
      )}
    </div>
  )

  // Máscara visual basada en dateFormat
  const maskFormat = dateFormat.toUpperCase()

  const inputGroupContent = (
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
      {hasTime && (
        <InputGroupAddon align="inline-end">
          <TimePicker
            format={timeFormat}
            value={timeValue}
            className="border-0 -mr-5"
            onChange={(value) => {
              setTimeValue(value || '')
            }}
          />
        </InputGroupAddon>
      )}
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
          <PopoverContent className="w-auto p-0" align="start">
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

      {/* Mensaje de error */}
      {hasError && (inputError || errorMessage) && (
        <p
          id={`${id}-error`}
          className="mt-1 text-sm text-destructive"
          role="alert"
        >
          {inputError || errorMessage}
        </p>
      )}
    </div>
  )
}

export default DatePicker
