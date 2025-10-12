'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface DateTimePickerProps {
  value?: string // ISO string format
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  disabledDates?: Date[]
  availableTimeSlots?: string[]
  minDate?: Date
  maxDate?: Date
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = 'Seleccionar fecha y hora',
  disabled = false,
  className,
  disabledDates = [],
  availableTimeSlots,
  minDate,
  maxDate,
}: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  )
  const [selectedTime, setSelectedTime] = React.useState<string | null>(
    value ? format(new Date(value), 'HH:mm') : null
  )

  // Generate default time slots from 9:00 to 18:00 in 15-minute intervals
  const defaultTimeSlots = React.useMemo(() => {
    return Array.from({ length: 37 }, (_, i) => {
      const totalMinutes = i * 15
      const hour = Math.floor(totalMinutes / 60) + 9
      const minute = totalMinutes % 60
      return `${hour.toString().padStart(2, '0')}:${minute
        .toString()
        .padStart(2, '0')}`
    })
  }, [])

  const timeSlots = availableTimeSlots || defaultTimeSlots

  // Update parent when date or time changes
  React.useEffect(() => {
    if (selectedDate && selectedTime && onChange) {
      const [hours, minutes] = selectedTime.split(':').map(Number)
      const dateTime = new Date(selectedDate)
      dateTime.setHours(hours, minutes, 0, 0)
      onChange(dateTime.toISOString())
    }
  }, [selectedDate, selectedTime, onChange])

  // Update internal state when value prop changes
  React.useEffect(() => {
    if (value) {
      const date = new Date(value)
      setSelectedDate(date)
      setSelectedTime(format(date, 'HH:mm'))
    } else {
      setSelectedDate(undefined)
      setSelectedTime(null)
    }
  }, [value])

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    if (!date) {
      setSelectedTime(null)
    }
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const displayText = () => {
    if (selectedDate && selectedTime) {
      return `${format(selectedDate, 'dd/MM/yyyy', { locale: es })} a las ${selectedTime}`
    }
    return placeholder
  }

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    return disabledDates.some(
      (disabledDate) =>
        format(date, 'yyyy-MM-dd') === format(disabledDate, 'yyyy-MM-dd')
    )
  }

  if (disabled) {
    return (
      <div className={cn('text-sm text-muted-foreground', className)}>
        {displayText()}
      </div>
    )
  }

  return (
    <Card className={cn('gap-0 p-0', className)}>
      <CardContent className="relative p-0 md:pr-48">
        <div className="p-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            defaultMonth={selectedDate}
            disabled={isDateDisabled}
            showOutsideDays={false}
            modifiers={{
              booked: disabledDates,
            }}
            modifiersClassNames={{
              booked: '[&>button]:line-through opacity-100',
            }}
            className="bg-transparent p-0 [--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
            formatters={{
              formatWeekdayName: (date) => {
                return date.toLocaleString('es-ES', { weekday: 'short' })
              },
            }}
            locale={es}
          />
        </div>
        <div className="no-scrollbar inset-y-0 right-0 flex max-h-72 w-full scroll-pb-6 flex-col gap-4 overflow-y-auto border-t p-6 md:absolute md:max-h-none md:w-48 md:border-t-0 md:border-l">
          <div className="grid gap-2">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? 'default' : 'outline'}
                onClick={() => handleTimeSelect(time)}
                className="w-full shadow-none"
                disabled={!selectedDate}
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 border-t px-6 !py-5 md:flex-row">
        <div className="text-sm">
          {selectedDate && selectedTime ? (
            <>
              Cita programada para el{' '}
              <span className="font-medium">
                {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: es })}
              </span>{' '}
              a las <span className="font-medium">{selectedTime}</span>.
            </>
          ) : (
            <>Selecciona una fecha y hora para la cita.</>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
