'use client'

import * as React from 'react'
import { format, parse, isValid } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { InputGroup } from '@/components/ui/input-group'
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

import { useIsMobile } from '@/hooks/use-mobile'

export interface DateDisplayProps {
  date?: Date
  hasTime?: boolean
  placeholder?: string
  className?: string
}

export function DateDisplay({
  date,
  hasTime = false,
  placeholder = 'No hay fecha seleccionada',
  className,
}: DateDisplayProps) {
  if (!date) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 text-muted-foreground text-sm',
          className
        )}
      >
        <Calendar className="h-4 w-4" />
        <span>{placeholder}</span>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-2 text-sm', className)}>
      <Calendar className="h-4 w-4 text-primary" />
      <div className="flex flex-col">
        <span className="font-medium">
          {format(date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es })}
        </span>
        {hasTime && (
          <div className="flex items-center gap-1 text-muted-foreground text-xs">
            <Clock className="h-3 w-3" />
            <span>{format(date, 'HH:mm', { locale: es })}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export interface DatePickerProps {
  value?: string // ISO string format (YYYY-MM-DDTHH:mm:ss.sssZ)
  onChange?: (value: string | undefined) => void
  placeholder?: string
  disabled?: boolean
  hasTime?: boolean
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[]
  className?: string
  error?: string
  required?: boolean
  name?: string
  id?: string
  onFocus?: () => void
  onBlur?: () => void
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Seleccionar fecha',
  disabled = false,
  hasTime = false,
  minDate,
  maxDate,
  disabledDates = [],
  className,
  error,
  required = false,
  name,
  id,
  onFocus,
  onBlur,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>()
  const [selectedHour, setSelectedHour] = React.useState<string>('')
  const [selectedMinute, setSelectedMinute] = React.useState<string>('')
  const [timeInput, setTimeInput] = React.useState<string>('')
  const [amPm, setAmPm] = React.useState<'AM' | 'PM'>('AM')
  const timeInputRef = React.useRef<HTMLInputElement>(null)
  const isMobile = useIsMobile()

  // Initialize state from value prop
  React.useEffect(() => {
    if (value) {
      try {
        const date = new Date(value)
        if (isValid(date)) {
          setSelectedDate(date)
          setInputValue(format(date, 'dd/MM/yyyy'))
          if (hasTime) {
            const hour24 = parseInt(format(date, 'HH'))
            const minute = format(date, 'mm')
            setSelectedHour(format(date, 'HH'))
            setSelectedMinute(minute)

            // Convert to 12-hour format for display
            const hour12 =
              hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24
            const period = hour24 >= 12 ? 'PM' : 'AM'
            const timeValue = `${hour12.toString().padStart(2, '0')}:${minute}`
            setTimeInput(timeValue)
            setAmPm(period)

            // Ensure the time input ref is updated after state changes
            setTimeout(() => {
              if (timeInputRef.current) {
                timeInputRef.current.value = timeValue
              }
            }, 0)
          }
        }
      } catch (error) {
        console.warn('Invalid date value provided to DatePicker:', value)
      }
    } else {
      setSelectedDate(undefined)
      setInputValue('')
      setSelectedHour('')
      setSelectedMinute('')
      setTimeInput('')
      if (timeInputRef.current) {
        timeInputRef.current.value = ''
      }
      setAmPm('AM')
    }
  }, [value, hasTime])

  // Helper function to update time input display
  const updateTimeInputDisplay = React.useCallback(() => {
    if (hasTime && selectedHour && selectedMinute) {
      const hour24 = parseInt(selectedHour)
      const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24
      const period = hour24 >= 12 ? 'PM' : 'AM'
      const timeValue = `${hour12.toString().padStart(2, '0')}:${selectedMinute}`

      // Update the time input ref if available
      if (timeInputRef.current) {
        timeInputRef.current.value = timeValue
      }

      // Always update the state to maintain consistency
      setTimeInput(timeValue)
      setAmPm(period)
    }
  }, [hasTime, selectedHour, selectedMinute])

  // Update time input display when time states change
  React.useEffect(() => {
    if (hasTime && selectedHour && selectedMinute) {
      updateTimeInputDisplay()
    }
  }, [hasTime, selectedHour, selectedMinute, updateTimeInputDisplay])

  // Update time input display when calendar reopens
  React.useEffect(() => {
    if (open && hasTime && selectedHour && selectedMinute) {
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        updateTimeInputDisplay()
      }, 0)
    }
  }, [open, hasTime, selectedHour, selectedMinute, updateTimeInputDisplay])

  // Process time input and validate
  const processTimeInput = (inputValue: string) => {
    if (inputValue.length === 5) {
      const [hourStr, minuteStr] = inputValue.split(':')
      const hour = parseInt(hourStr)
      const minute = parseInt(minuteStr)

      // Validate 12-hour format
      if (hour >= 1 && hour <= 12 && minute >= 0 && minute <= 59) {
        // Convert to 24-hour format
        const hour24 =
          amPm === 'AM'
            ? hour === 12
              ? 0
              : hour
            : hour === 12
              ? 12
              : hour + 12

        const hour24Str = hour24.toString().padStart(2, '0')
        const minuteStr24 = minute.toString().padStart(2, '0')

        setSelectedHour(hour24Str)
        setSelectedMinute(minuteStr24)
        setTimeInput(inputValue)

        if (selectedDate) {
          updateValue(selectedDate, hour24Str, minuteStr24)
        }
      }
    }
  }

  // Apply input mask for DD/MM/YYYY format with intelligent editing
  const applyDateMask = (input: string, cursorPosition?: number) => {
    // Remove all non-numeric characters
    const numbers = input.replace(/\D/g, '')

    // Apply mask DD/MM/YYYY
    let masked = numbers
    if (numbers.length >= 2) {
      masked = numbers.slice(0, 2) + '/' + numbers.slice(2)
    }
    if (numbers.length >= 4) {
      masked =
        numbers.slice(0, 2) +
        '/' +
        numbers.slice(2, 4) +
        '/' +
        numbers.slice(4, 8)
    }

    return masked
  }

  // Handle backspace and delete for character-by-character editing
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    const { selectionStart, selectionEnd } = input

    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault()

      let newValue = inputValue
      let newCursorPos = selectionStart || 0

      if (selectionStart !== selectionEnd) {
        // Handle selection deletion
        newValue =
          inputValue.slice(0, selectionStart || 0) +
          inputValue.slice(selectionEnd || 0)
        newCursorPos = selectionStart || 0
      } else if (
        e.key === 'Backspace' &&
        selectionStart &&
        selectionStart > 0
      ) {
        // Handle backspace
        const prevChar = inputValue[selectionStart - 1]
        if (prevChar === '/') {
          // Skip the slash and delete the number before it
          if (selectionStart > 1) {
            newValue =
              inputValue.slice(0, selectionStart - 2) +
              inputValue.slice(selectionStart)
            newCursorPos = selectionStart - 2
          }
        } else {
          newValue =
            inputValue.slice(0, selectionStart - 1) +
            inputValue.slice(selectionStart)
          newCursorPos = selectionStart - 1
        }
      } else if (
        e.key === 'Delete' &&
        selectionStart !== null &&
        selectionStart < inputValue.length
      ) {
        // Handle delete
        const nextChar = inputValue[selectionStart]
        if (nextChar === '/') {
          // Skip the slash and delete the number after it
          if (selectionStart < inputValue.length - 1) {
            newValue =
              inputValue.slice(0, selectionStart) +
              inputValue.slice(selectionStart + 2)
          }
        } else {
          newValue =
            inputValue.slice(0, selectionStart) +
            inputValue.slice(selectionStart + 1)
        }
        newCursorPos = selectionStart
      }

      // Apply mask to the new value
      const maskedValue = applyDateMask(newValue)
      setInputValue(maskedValue)

      // Set cursor position after state update
      setTimeout(() => {
        if (input && newCursorPos !== null) {
          // Adjust cursor position for added slashes
          let adjustedPos = newCursorPos
          if (maskedValue.length > newCursorPos) {
            const beforeCursor = maskedValue.slice(0, newCursorPos)
            const slashCount = (beforeCursor.match(/\//g) || []).length
            const originalSlashCount = (
              newValue.slice(0, newCursorPos).match(/\//g) || []
            ).length
            adjustedPos = Math.min(
              newCursorPos + (slashCount - originalSlashCount),
              maskedValue.length
            )
          }
          input.setSelectionRange(adjustedPos, adjustedPos)
        }
      }, 0)

      // Try to parse and validate the date
      if (maskedValue === '') {
        setSelectedDate(undefined)
        onChange?.(undefined)
      } else if (maskedValue.length === 10) {
        const parsedDate = parseInputDate(maskedValue)
        if (parsedDate && !isDateDisabled(parsedDate)) {
          setSelectedDate(parsedDate)
          updateValue(parsedDate, selectedHour, selectedMinute)
        }
      }

      return
    }

    // Handle other navigation keys
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setOpen(!open)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  // Validate and parse date from input
  const parseInputDate = (input: string): Date | null => {
    if (input.length !== 10) return null

    try {
      const parsedDate = parse(input, 'dd/MM/yyyy', new Date())
      return isValid(parsedDate) ? parsedDate : null
    } catch {
      return null
    }
  }

  // Check if date is disabled
  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    return disabledDates.some(
      (disabledDate) =>
        format(date, 'yyyy-MM-dd') === format(disabledDate, 'yyyy-MM-dd')
    )
  }

  // Handle input change with mask
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = applyDateMask(e.target.value)
    setInputValue(maskedValue)

    // Try to parse and validate the date
    const parsedDate = parseInputDate(maskedValue)
    if (parsedDate && !isDateDisabled(parsedDate)) {
      setSelectedDate(parsedDate)
      updateValue(parsedDate, selectedHour, selectedMinute)

      // Update time input display if we have time selected
      if (hasTime && selectedHour && selectedMinute) {
        setTimeout(() => {
          updateTimeInputDisplay()
        }, 0)
      }
    } else if (maskedValue === '') {
      setSelectedDate(undefined)
      onChange?.(undefined)
    }
  }

  // Handle calendar date selection
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) {
      setInputValue(format(date, 'dd/MM/yyyy'))
      updateValue(date, selectedHour, selectedMinute)

      // Update time input display if we have time selected
      if (hasTime && selectedHour && selectedMinute) {
        setTimeout(() => {
          updateTimeInputDisplay()
        }, 0)
      }

      if (!hasTime) {
        setOpen(false)
      }
    } else {
      setInputValue('')
      onChange?.(undefined)
    }
  }

  // Handle time input with mask HH:MM (uncontrolled approach)
  const handleTimeInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value

      // If user is deleting (backspace), allow it without formatting
      if (rawValue.length < (timeInputRef.current?.value.length || 0)) {
        if (timeInputRef.current) {
          timeInputRef.current.value = rawValue
        }
        return
      }

      const input = rawValue.replace(/\D/g, '') // Remove non-digits
      let masked = input

      if (input.length >= 2) {
        masked = input.slice(0, 2) + ':' + input.slice(2, 4)
      }

      // Limit to HH:MM format
      if (masked.length > 5) {
        masked = masked.slice(0, 5)
      }

      // Update the input value directly without causing re-render
      if (timeInputRef.current) {
        timeInputRef.current.value = masked
      }
    },
    []
  )

  // Handle time input blur - process and validate the time
  const handleTimeInputBlur = React.useCallback(() => {
    if (timeInputRef.current) {
      const inputValue = timeInputRef.current.value
      processTimeInput(inputValue)
    }
  }, [amPm, selectedDate])

  // Handle AM/PM toggle
  const handleAmPmChange = (period: 'AM' | 'PM') => {
    setAmPm(period)

    // Update time if we have a valid time input
    if (timeInput.length === 5 && selectedHour && selectedMinute) {
      const [hourStr] = timeInput.split(':')
      const hour = parseInt(hourStr)

      if (hour >= 1 && hour <= 12) {
        // Convert to 24-hour format with new period
        const hour24 =
          period === 'AM'
            ? hour === 12
              ? 0
              : hour
            : hour === 12
              ? 12
              : hour + 12

        const hour24Str = hour24.toString().padStart(2, '0')
        setSelectedHour(hour24Str)

        if (selectedDate) {
          updateValue(selectedDate, hour24Str, selectedMinute)
        }
      }
    }
  }

  // Update parent component with new value
  const updateValue = (date: Date, hour: string, minute: string) => {
    if (!date) {
      onChange?.(undefined)
      return
    }

    const newDate = new Date(date)
    if (hasTime && hour && minute) {
      newDate.setHours(parseInt(hour), parseInt(minute), 0, 0)
    } else {
      newDate.setHours(0, 0, 0, 0)
    }

    onChange?.(newDate.toISOString())
  }

  // Handle input focus
  const handleInputFocus = () => {
    onFocus?.()
  }

  // Handle input blur
  const handleInputBlur = () => {
    onBlur?.()

    // Validate final input value
    if (inputValue && inputValue.length === 10) {
      const parsedDate = parseInputDate(inputValue)
      if (!parsedDate || isDateDisabled(parsedDate)) {
        // Reset to previous valid value or empty
        if (selectedDate) {
          setInputValue(format(selectedDate, 'dd/MM/yyyy'))
        } else {
          setInputValue('')
        }
      }
    }
  }

  // Generate display text for the input
  const getDisplayText = () => {
    if (inputValue) {
      if (hasTime && selectedHour && selectedMinute) {
        return `${inputValue} ${selectedHour}:${selectedMinute}`
      }
      return inputValue
    }
    return ''
  }

  // Generate placeholder text
  const getPlaceholderText = () => {
    if (hasTime) {
      return 'DD/MM/YYYY HH:MM'
    }
    return 'DD/MM/YYYY'
  }

  // Generate background placeholder that shows behind the text
  const getBackgroundPlaceholder = () => {
    const placeholder = getPlaceholderText()
    const currentValue = getDisplayText()

    if (!currentValue) {
      return placeholder
    }

    // Show remaining placeholder characters
    if (currentValue.length < placeholder.length) {
      return currentValue + placeholder.slice(currentValue.length)
    }

    return currentValue
  }

  // Calendar content component
  const CalendarContent = () => (
    <div className="p-3 flex">
      <div className="flex-1">
        <CalendarComponent
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          disabled={isDateDisabled}
          locale={es}
          className="rounded-md !w-full !max-w-sm"
        />
        {!hasTime && (
          <div className="mt-4 pt-3 border-t">
            <DateDisplay
              date={selectedDate}
              hasTime={hasTime}
              placeholder="Selecciona una fecha"
            />
          </div>
        )}
      </div>
      {hasTime && (
        <div className="flex flex-col justify-around border-l-2 border-border pl-4 ml-4 flex-shrink-0 w-48">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Hora
              </label>
              <div className="flex flex-col items-center gap-6">
                <div className="flex-1">
                  <input
                    ref={timeInputRef}
                    type="text"
                    onChange={handleTimeInputChange}
                    onBlur={handleTimeInputBlur}
                    placeholder="HH:MM"
                    className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    maxLength={5}
                  />
                </div>
                <div className="flex flex-col gap-3 w-full">
                  <Button
                    type="button"
                    variant={amPm === 'AM' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleAmPmChange('AM')}
                    className="px-3 py-2 text-xs w-full"
                  >
                    AM
                  </Button>
                  <Button
                    type="button"
                    variant={amPm === 'PM' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleAmPmChange('PM')}
                    className="px-3 py-2 text-xs w-full"
                  >
                    PM
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <div className="pt-3 border-t">
              <DateDisplay
                date={selectedDate}
                hasTime={hasTime}
                placeholder="Selecciona una fecha"
                className="mb-3"
              />
            </div>
            {selectedDate && selectedHour && selectedMinute && (
              <Button
                onClick={() => setOpen(false)}
                className="w-full"
                size="sm"
              >
                Confirmar
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className={cn('relative', className)}>
      {isMobile ? (
        <Sheet open={open} onOpenChange={setOpen}>
          <InputGroup
            className={cn(
              error && 'border-destructive ring-destructive/20',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <div className="relative flex-1">
              {/* Background placeholder */}
              <div
                className={cn(
                  'absolute inset-0 px-3 py-2 text-sm pointer-events-none',
                  'text-muted-foreground/50 select-none',
                  disabled && 'cursor-not-allowed'
                )}
                aria-hidden="true"
              >
                {getBackgroundPlaceholder()}
              </div>

              {/* Actual input */}
              <input
                id={id}
                name={name}
                type="text"
                value={getDisplayText()}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                onKeyDown={handleKeyDown}
                placeholder=""
                disabled={disabled}
                required={required}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
                className={cn(
                  'relative bg-transparent px-3 py-2 text-sm outline-none w-full',
                  'placeholder:text-muted-foreground',
                  disabled && 'cursor-not-allowed'
                )}
                data-slot="input-group-control"
              />
            </div>
            <div className="flex items-center px-3">
              {hasTime && (
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              )}
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  disabled={disabled}
                  onClick={() => setOpen(!open)}
                >
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </Button>
              </SheetTrigger>
            </div>
          </InputGroup>
          <SheetContent side="bottom" className="h-auto">
            <SheetHeader>
              <SheetTitle>
                {hasTime ? 'Seleccionar fecha y hora' : 'Seleccionar fecha'}
              </SheetTitle>
            </SheetHeader>
            <CalendarContent />
          </SheetContent>
        </Sheet>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <InputGroup
            className={cn(
              error && 'border-destructive ring-destructive/20',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <div className="relative flex-1">
              {/* Background placeholder */}
              <div
                className={cn(
                  'absolute inset-0 px-3 py-2 text-sm pointer-events-none',
                  'text-muted-foreground/50 select-none',
                  disabled && 'cursor-not-allowed'
                )}
                aria-hidden="true"
              >
                {getBackgroundPlaceholder()}
              </div>

              {/* Actual input */}
              <input
                id={id}
                name={name}
                type="text"
                value={getDisplayText()}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                onKeyDown={handleKeyDown}
                placeholder=""
                disabled={disabled}
                required={required}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
                className={cn(
                  'relative bg-transparent px-3 py-2 text-sm outline-none w-full',
                  'placeholder:text-muted-foreground',
                  disabled && 'cursor-not-allowed'
                )}
                data-slot="input-group-control"
              />
            </div>
            <div className="flex items-center px-3">
              {hasTime && (
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              )}
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  disabled={disabled}
                  onClick={() => setOpen(!open)}
                >
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
            </div>
          </InputGroup>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarContent />
          </PopoverContent>
        </Popover>
      )}
      {error && (
        <p
          id={`${id}-error`}
          className="mt-1 text-xs text-destructive"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  )
}
