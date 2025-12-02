'use client'

import * as React from 'react'
import { useState, useCallback, useMemo, useEffect } from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import { format, parse, isValid } from 'date-fns'
import { es } from 'date-fns/locale'
import { useMaskito } from '@maskito/react'
import { maskitoDateOptionsGenerator } from '@maskito/kit'
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
import { DayPicker } from 'react-day-picker'
import { TimePicker, type TimePickerProps } from '@/components/ui/time-picker'
import { ButtonGroup } from './button-group'

const DATE_FORMAT = 'dd/MM/yyyy'

// Función auxiliar para combinar fecha y hora
function combineDateTime(
  date: Date,
  timeString: string,
  format: '12h' | '24h'
): Date {
  const timeParts = timeString.match(/(\d{1,2}):(\d{2})(?:\s*(AM|PM))?/i)
  if (!timeParts) return date

  let hours = parseInt(timeParts[1], 10)
  const minutes = parseInt(timeParts[2], 10)
  const period = timeParts[3]?.toUpperCase()

  // Convertir de 12h a 24h si es necesario
  if (format === '12h' && period) {
    if (period === 'PM' && hours !== 12) {
      hours += 12
    } else if (period === 'AM' && hours === 12) {
      hours = 0
    }
  }

  const newDate = new Date(date)
  newDate.setHours(hours, minutes, 0, 0)
  return newDate
}

export interface DatePickerProps
  extends Omit<React.ComponentProps<'input'>, 'value' | 'onChange'> {
  /**
   * Valor de la fecha en formato ISO string o Date
   */
  value?: Date | string
  /**
   * Callback cuando cambia la fecha
   */
  onChange?: (date: Date | undefined) => void
  /**
   * Estado de error del campo
   */
  error?: boolean | string

  calendarProps?: Omit<
    React.ComponentProps<typeof DayPicker>,
    'selected' | 'onSelect' | 'mode'
  > & {
    buttonVariant?: React.ComponentProps<typeof Button>['variant']
  }

  /**
   * Mostrar selector de tiempo junto con la fecha
   */
  hasTime?: boolean

  /**
   * Props para el TimePicker
   */
  timeProps?: Omit<TimePickerProps, 'value' | 'onChange' | 'className'>
}

/**
 * Componente DatePicker simplificado que usa Maskito para el manejo de máscaras
 */
export function DatePicker({
  value,
  onChange,
  error,
  calendarProps,
  hasTime = false,
  timeProps,
  ...props
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [timeValue, setTimeValue] = useState<string>('')
  const isMobile = useIsMobile()

  // Configuración de Maskito para fecha dd/MM/yyyy
  const maskitoOptions = useMemo(
    () =>
      maskitoDateOptionsGenerator({
        mode: 'dd/mm/yyyy',
        separator: '/',
      }),
    []
  )

  const maskedInputRef = useMaskito({ options: maskitoOptions })

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

  // Sincronizar inputValue y timeValue con dateValue
  useEffect(() => {
    if (dateValue) {
      setInputValue(format(dateValue, DATE_FORMAT))
      if (hasTime) {
        const hours = dateValue.getHours()
        const minutes = dateValue.getMinutes()
        const timeFormat = timeProps?.format || '24h'

        if (timeFormat === '12h') {
          const period = hours >= 12 ? 'PM' : 'AM'
          const displayHours = hours % 12 || 12
          setTimeValue(
            `${String(displayHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`
          )
        } else {
          setTimeValue(
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
          )
        }
      }
    } else {
      setInputValue('')
      setTimeValue('')
    }
  }, [dateValue, hasTime, timeProps?.format])

  // Validar y parsear fecha del input
  const validateAndParseDate = useCallback((inputVal: string): Date | null => {
    if (!inputVal.trim()) return null

    const parsedDate = parse(inputVal, DATE_FORMAT, new Date())
    if (!isValid(parsedDate)) return null

    return parsedDate
  }, [])

  // Manejar cambio en el input
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setInputValue(newValue)

      // Solo validar si el input tiene el formato completo
      if (newValue.length === DATE_FORMAT.length) {
        const validatedDate = validateAndParseDate(newValue)
        if (validatedDate) {
          onChange?.(validatedDate)
        }
      } else if (!newValue.trim()) {
        onChange?.(undefined)
      }
    },
    [validateAndParseDate, onChange]
  )

  // Manejar blur del input
  const handleInputBlur = useCallback(() => {
    if (inputValue.trim()) {
      const validatedDate = validateAndParseDate(inputValue)
      if (validatedDate) {
        onChange?.(validatedDate)
      } else {
        // Si la fecha no es válida, restaurar el valor anterior
        if (dateValue) {
          setInputValue(format(dateValue, DATE_FORMAT))
        } else {
          setInputValue('')
        }
      }
    }
  }, [inputValue, validateAndParseDate, onChange, dateValue])

  // Manejar selección desde el calendario
  const handleCalendarSelect = useCallback(
    (selectedDate: Date | undefined) => {
      if (selectedDate) {
        setSelectedDate(selectedDate)
        if (!isMobile) {
          // En desktop, aplicar inmediatamente
          setInputValue(format(selectedDate, DATE_FORMAT))

          // Si hasTime está activado y hay un timeValue, combinar fecha y hora
          let finalDate = selectedDate
          if (hasTime && timeValue) {
            finalDate = combineDateTime(
              selectedDate,
              timeValue,
              timeProps?.format || '24h'
            )
          }

          onChange?.(finalDate)

          // Solo cerrar si no hay time picker o si ya está completo
          if (!hasTime) {
            setOpen(false)
          }
        }
      }
    },
    [onChange, isMobile, hasTime, timeValue, timeProps?.format]
  )

  // Manejar botón "Hoy"
  const handleTodayClick = useCallback(() => {
    const today = new Date()
    setSelectedDate(today)

    // Si hasTime está activado, establecer la hora actual también
    if (hasTime) {
      const hours = today.getHours()
      const minutes = today.getMinutes()
      const timeFormat = timeProps?.format || '24h'

      if (timeFormat === '12h') {
        const period = hours >= 12 ? 'PM' : 'AM'
        const displayHours = hours % 12 || 12
        setTimeValue(
          `${String(displayHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`
        )
      } else {
        setTimeValue(
          `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
        )
      }
    }

    if (!isMobile) {
      // En desktop, aplicar inmediatamente
      setInputValue(format(today, DATE_FORMAT))
      onChange?.(today)

      // Solo cerrar si no hay time picker
      if (!hasTime) {
        setOpen(false)
      }
    }
  }, [onChange, isMobile, hasTime, timeProps?.format])

  // Manejar cambio de tiempo
  const handleTimeChange = useCallback(
    (newTimeValue: string) => {
      setTimeValue(newTimeValue)

      // Si hay una fecha seleccionada, combinar fecha y hora
      if (selectedDate && newTimeValue) {
        const combinedDate = combineDateTime(
          selectedDate,
          newTimeValue,
          timeProps?.format || '24h'
        )

        // En desktop, aplicar inmediatamente
        if (!isMobile) {
          onChange?.(combinedDate)
        }
      }
    },
    [selectedDate, onChange, isMobile, timeProps?.format]
  )

  // Manejar confirmación en mobile
  const handleConfirm = useCallback(() => {
    if (selectedDate) {
      setInputValue(format(selectedDate, DATE_FORMAT))

      // Si hasTime está activado y hay timeValue, combinar fecha y hora
      let finalDate = selectedDate
      if (hasTime && timeValue) {
        finalDate = combineDateTime(
          selectedDate,
          timeValue,
          timeProps?.format || '24h'
        )
      }

      onChange?.(finalDate)
    }
    setOpen(false)
  }, [selectedDate, onChange, hasTime, timeValue, timeProps?.format])

  // Manejar cancelación en mobile
  const handleCancel = useCallback(() => {
    setSelectedDate(dateValue)
    setOpen(false)
  }, [dateValue])

  // Manejar click en el botón del calendario
  const handleCalendarButtonClick = useCallback(() => {
    // Inicializar selectedDate con el valor actual al abrir
    setSelectedDate(dateValue)
    setOpen(!open)
  }, [open, dateValue])

  // Componente de calendario reutilizable
  const CalendarComponent = () => (
    <div className="flex flex-col items-center gap-2">
      <Calendar
        mode="single"
        captionLayout="dropdown"
        selected={selectedDate}
        onSelect={handleCalendarSelect}
        locale={es}
        className={cn('w-full', isMobile && 'max-w-sm')}
        {...calendarProps}
      />

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
    </div>
  )

  const inputGroupContent = (
    <ButtonGroup>
      <InputGroup
        data-disabled={props.disabled}
        className={cn(
          error && 'border-destructive ring-destructive/20',
          props.disabled && 'opacity-50'
        )}
      >
        <InputGroupInput
          ref={maskedInputRef}
          type="text"
          placeholder={DATE_FORMAT}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          aria-invalid={!!error}
          className={cn(
            'font-mono',
            error && 'text-destructive placeholder:text-destructive/50'
          )}
          {...props}
        />
        <InputGroupAddon align="inline-end">
          {isMobile ? (
            <InputGroupButton
              type="button"
              variant="ghost"
              size="icon-xs"
              disabled={props.disabled}
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
                disabled={props.disabled}
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
      {hasTime && (
        <>
          <TimePicker
            value={timeValue}
            onChange={handleTimeChange}
            format={timeProps?.format || '24h'}
            placeholder={timeProps?.placeholder}
            disabled={timeProps?.disabled || props.disabled}
            error={!!timeProps?.error}
            errorMessage={timeProps?.errorMessage}
          />
        </>
      )}
    </ButtonGroup>
  )

  return (
    <>
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
          <SheetContent side="bottom" className="h-auto">
            <SheetHeader>
              <SheetTitle>Seleccionar fecha</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <CalendarComponent />
            </div>
            <SheetFooter className="flex flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleConfirm}
                className="flex-1"
                disabled={!selectedDate}
              >
                Confirmar
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}
    </>
  )
}

type DateDisplayProps = Omit<React.ComponentProps<'span'>, 'children'> & {
  value?: Date | string | null
}

export function DateDisplay({ value, ...props }: DateDisplayProps) {
  if (!value) {
    return null
  }
  return <span {...props}>{format(value, 'dd/MM/yyyy', { locale: es })}</span>
}

export default DatePicker
