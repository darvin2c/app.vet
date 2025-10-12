'use client'

import * as React from 'react'
import { constructNow, format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar as CalendarIcon, Trash, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

interface DateTimeRangePickerProps {
  startValue?: Date
  endValue?: Date
  onStartChange?: (date: Date | undefined) => void
  onEndChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  minDate?: Date
  disabledDates?: Date[]
  availableTimeSlots?: string[]
  className?: string
}

export default function Calendar20({
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  placeholder = 'Seleccionar fecha y hora',
  disabled = false,
  minDate,
  disabledDates = [],
  availableTimeSlots = [],
  className,
}: DateTimeRangePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(startValue)
  const [startTime, setStartTime] = React.useState<string | null>(null)
  const [endTime, setEndTime] = React.useState<string | null>(null)
  const [open, setOpen] = React.useState(false)
  const isMobile = useIsMobile()
  const [selectionMode, setSelectionMode] = React.useState<'start' | 'end'>(
    'start'
  )

  // Referencias para rastrear si el cambio proviene del usuario
  const isUserActionRef = React.useRef(false)

  // Referencia al contenedor de scroll de horas
  const timeScrollContainerRef = React.useRef<HTMLDivElement>(null)

  // Generate default time slots if not provided
  const timeSlots = React.useMemo(() => {
    const defaultSlots = Array.from({ length: 48 }, (_, i) => {
      const totalMinutes = i * 30
      const hour = Math.floor(totalMinutes / 60)
      const minute = totalMinutes % 60
      return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    })

    // Add custom times if they exist and are not in default slots
    const customTimes = []
    if (startTime && !defaultSlots.includes(startTime)) {
      customTimes.push(startTime)
    }
    if (endTime && !defaultSlots.includes(endTime)) {
      customTimes.push(endTime)
    }

    // Combine and sort all times
    const allSlots = [...defaultSlots, ...customTimes].sort((a, b) => {
      const [aHour, aMin] = a.split(':').map(Number)
      const [bHour, bMin] = b.split(':').map(Number)
      const aTotal = aHour * 60 + aMin
      const bTotal = bHour * 60 + bMin
      return aTotal - bTotal
    })

    return allSlots
  }, [startTime, endTime])

  // Update date when startValue prop changes
  React.useEffect(() => {
    // Solo actualizar si no es una acción del usuario
    if (!isUserActionRef.current) {
      setDate(startValue)
      if (startValue) {
        const timeString = format(startValue, 'HH:mm')
        setStartTime(timeString)
      } else {
        setStartTime(null)
      }
    }
    // Resetear la bandera después de procesar
    isUserActionRef.current = false
  }, [startValue])

  // Update endTime when endValue prop changes
  React.useEffect(() => {
    // Solo actualizar si no es una acción del usuario
    if (!isUserActionRef.current) {
      if (endValue) {
        const timeString = format(endValue, 'HH:mm')
        setEndTime(timeString)
      } else {
        setEndTime(null)
      }
    }
    // Resetear la bandera después de procesar
    isUserActionRef.current = false
  }, [endValue])

  // Función para centrar la hora actual o seleccionada
  const scrollToCurrentTime = React.useCallback(() => {
    console.log('🔍 scrollToCurrentTime ejecutándose...')

    if (!timeScrollContainerRef.current) {
      console.log('❌ No se encontró timeScrollContainerRef.current')
      return
    }

    // Determinar qué hora usar para centrar
    let targetTime = startTime

    // Si no hay hora seleccionada, usar la hora actual
    if (!targetTime) {
      const now = new Date()
      const currentHour = now.getHours()
      const currentMinute = now.getMinutes()

      console.log(`⏰ Hora actual: ${currentHour}:${currentMinute}`)

      // Redondear a la media hora más cercana (para intervalos de 30 minutos)
      const roundedMinute = currentMinute >= 30 ? 30 : 0
      targetTime = `${currentHour.toString().padStart(2, '0')}:${roundedMinute.toString().padStart(2, '0')}`
    }

    console.log(`🎯 Hora objetivo: ${targetTime}`)

    // Buscar el botón correspondiente a la hora objetivo
    const targetButton = timeScrollContainerRef.current.querySelector(
      `button[data-time="${targetTime}"]`
    ) as HTMLElement

    console.log('🔍 Botón encontrado:', targetButton)
    console.log(
      '📋 Todos los botones con data-time:',
      Array.from(
        timeScrollContainerRef.current.querySelectorAll('button[data-time]')
      ).map((btn) => btn.getAttribute('data-time'))
    )

    if (targetButton) {
      console.log('✅ Haciendo scroll al botón:', targetTime)

      // Método alternativo: scroll manual con cálculo de posición
      const container = timeScrollContainerRef.current
      const containerRect = container.getBoundingClientRect()
      const buttonRect = targetButton.getBoundingClientRect()

      // Calcular la posición relativa del botón dentro del contenedor
      const buttonTop = buttonRect.top - containerRect.top + container.scrollTop
      const containerHeight = container.clientHeight
      const buttonHeight = buttonRect.height

      // Centrar el botón en el contenedor
      const scrollPosition = buttonTop - containerHeight / 2 + buttonHeight / 2

      console.log('📐 Cálculos de scroll:', {
        containerHeight,
        buttonHeight,
        buttonTop,
        scrollPosition,
        currentScrollTop: container.scrollTop,
      })

      // Hacer scroll suave
      container.scrollTo({
        top: Math.max(0, scrollPosition),
        behavior: 'smooth',
      })
    } else {
      console.log('❌ No se encontró el botón para la hora:', targetTime)

      // Intentar buscar horas cercanas como fallback
      const [targetHour, targetMinute] = targetTime.split(':').map(Number)
      const fallbackTimes = [
        `${targetHour.toString().padStart(2, '0')}:00`,
        `${targetHour.toString().padStart(2, '0')}:30`,
        `${(targetHour - 1).toString().padStart(2, '0')}:30`,
        `${(targetHour + 1).toString().padStart(2, '0')}:00`,
      ]

      for (const fallbackTime of fallbackTimes) {
        const fallbackButton = timeScrollContainerRef.current.querySelector(
          `button[data-time="${fallbackTime}"]`
        ) as HTMLElement

        if (fallbackButton) {
          console.log(`🔄 Usando hora de fallback: ${fallbackTime}`)
          fallbackButton.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest',
          })
          break
        }
      }
    }
  }, [startTime])

  // Auto-scroll cuando se abre el calendario
  React.useEffect(() => {
    if (open) {
      // Delay aumentado para asegurar que el DOM esté renderizado
      const timer = setTimeout(() => {
        scrollToCurrentTime()
      }, 300)

      return () => clearTimeout(timer)
    } else {
    }
  }, [open, scrollToCurrentTime])

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate)
    setSelectionMode('start')

    // Mantener los tiempos seleccionados pero actualizar la fecha
    if (newDate) {
      // Si hay startTime, actualizar con la nueva fecha
      if (startTime) {
        const [hours, minutes] = startTime.split(':').map(Number)
        const newStartDateTime = new Date(newDate)
        newStartDateTime.setHours(hours, minutes, 0, 0)
        onStartChange?.(newStartDateTime)
      }

      // Si hay endTime, actualizar con la nueva fecha
      if (endTime) {
        const [hours, minutes] = endTime.split(':').map(Number)
        const newEndDateTime = new Date(newDate)
        newEndDateTime.setHours(hours, minutes, 0, 0)
        onEndChange?.(newEndDateTime)
      }
    } else {
      // Solo limpiar si no hay fecha seleccionada
      setStartTime(null)
      setEndTime(null)
      onStartChange?.(undefined)
      onEndChange?.(undefined)
    }
  }

  const handleTimeSelect = (time: string) => {
    if (!date) return

    const [hours, minutes] = time.split(':').map(Number)
    const newDateTime = new Date(date)
    newDateTime.setHours(hours, minutes, 0, 0)

    // Check if clicking on already selected time (deselection)
    if (startTime === time) {
      console.log('startTime === time', startTime, time)
      // Marcar como acción del usuario para evitar que useEffect lo revierta
      isUserActionRef.current = true

      // NUEVA REGLA: Si endTime existe, promoverlo a startTime
      if (endTime) {
        console.log('Promoviendo endTime a startTime:', endTime)
        const [endHours, endMinutes] = endTime.split(':').map(Number)
        const endDateTime = new Date(date)
        endDateTime.setHours(endHours, endMinutes, 0, 0)

        setStartTime(endTime)
        setEndTime(null)
        onStartChange?.(endDateTime)
        onEndChange?.(undefined)
        setSelectionMode('end')
      } else {
        setStartTime(null)
        onStartChange?.(undefined)
        setSelectionMode('start')
      }
      return
    }

    if (endTime === time) {
      console.log('endTime === time', endTime, time)
      // Marcar como acción del usuario para evitar que useEffect lo revierta
      isUserActionRef.current = true
      setEndTime(null)
      onEndChange?.(undefined)
      setSelectionMode('end') // Consistencia en modo de selección
      return
    }

    // If no times selected, set as start time
    if (!startTime && !endTime) {
      setStartTime(time)
      onStartChange?.(newDateTime)
      setSelectionMode('end')
      return
    }

    // If only start time is selected
    if (startTime && !endTime) {
      if (time > startTime) {
        // Selected time is after start time, set as end time
        setEndTime(time)
        onEndChange?.(newDateTime)
      } else {
        // Selected time is before start time, reorder automatically
        setEndTime(startTime)
        setStartTime(time)
        onStartChange?.(newDateTime)

        // Update end time with previous start time
        const [prevHours, prevMinutes] = startTime.split(':').map(Number)
        const prevDateTime = new Date(date)
        prevDateTime.setHours(prevHours, prevMinutes, 0, 0)
        onEndChange?.(prevDateTime)
      }
      return
    }

    // If only end time is selected
    if (!startTime && endTime) {
      if (time < endTime) {
        // Selected time is before end time, set as start time
        setStartTime(time)
        onStartChange?.(newDateTime)
        setSelectionMode('end')
      } else {
        // Selected time is after end time, reorder automatically
        setStartTime(endTime)
        setEndTime(time)
        onEndChange?.(newDateTime)

        // Update start time with previous end time
        const [prevHours, prevMinutes] = endTime.split(':').map(Number)
        const prevDateTime = new Date(date)
        prevDateTime.setHours(prevHours, prevMinutes, 0, 0)
        onStartChange?.(prevDateTime)
      }
      return
    }

    // If both times are selected, replace the closest one or reorder
    if (startTime && endTime) {
      const selectedMinutes = hours * 60 + minutes
      const startMinutes =
        parseInt(startTime.split(':')[0]) * 60 +
        parseInt(startTime.split(':')[1])
      const endMinutes =
        parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1])

      if (selectedMinutes < startMinutes) {
        // New time is before start, make it new start and keep end
        setStartTime(time)
        onStartChange?.(newDateTime)
      } else if (selectedMinutes > endMinutes) {
        // New time is after end, make it new end and keep start
        setEndTime(time)
        onEndChange?.(newDateTime)
      } else {
        // New time is between start and end, replace the closest one
        const distanceToStart = Math.abs(selectedMinutes - startMinutes)
        const distanceToEnd = Math.abs(selectedMinutes - endMinutes)

        if (distanceToStart <= distanceToEnd) {
          setStartTime(time)
          onStartChange?.(newDateTime)
        } else {
          setEndTime(time)
          onEndChange?.(newDateTime)
        }
      }
    }
  }

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (!date) return

    // Validate time format
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    if (!timeRegex.test(value)) return

    const [hours, minutes] = value.split(':').map(Number)
    const newDateTime = new Date(date)
    newDateTime.setHours(hours, minutes, 0, 0)

    setStartTime(value)
    onStartChange?.(newDateTime)

    // Clear end time if it's now invalid
    if (endTime && value >= endTime) {
      setEndTime(null)
      onEndChange?.(undefined)
    }
  }

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (!date || !startTime) return

    // Validate time format
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    if (!timeRegex.test(value)) return

    // Validate that end time is after start time
    if (value <= startTime) return

    const [hours, minutes] = value.split(':').map(Number)
    const newDateTime = new Date(date)
    newDateTime.setHours(hours, minutes, 0, 0)

    setEndTime(value)
    onEndChange?.(newDateTime)
  }

  const handleClearSelection = () => {
    setStartTime(null)
    setEndTime(null)
    setSelectionMode('start')
    onStartChange?.(undefined)
    onEndChange?.(undefined)
  }

  const handleContinue = () => {
    if (date && startTime && endTime) {
      setOpen(false)
    }
  }

  const displayValue = React.useMemo(() => {
    if (date && startTime && endTime) {
      return `${format(date, 'PPP', { locale: es })}, ${startTime} - ${endTime}`
    } else if (date && startTime) {
      return `${format(date, 'PPP', { locale: es })}, ${startTime} - ?`
    }
    return ''
  }, [date, startTime, endTime])

  const calendarContent = (
    <Card className="gap-0 p-0 border-0 shadow-none">
      <CardContent className="relative flex p-0 md:pr-48">
        <div className="p-2">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            defaultMonth={date}
            disabled={(date) => {
              if (minDate && date < minDate) return true
              return disabledDates.some(
                (disabledDate) =>
                  date.toDateString() === disabledDate.toDateString()
              )
            }}
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
          />
        </div>
        <div
          ref={timeScrollContainerRef}
          className="grow no-scrollbar inset-y-0 right-0 flex max-h-72 w-full scroll-pb-6 flex-col gap-4 overflow-y-auto border-t p-6 md:absolute md:max-h-none md:w-48 md:border-t-0 md:border-l"
        >
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-between">
              <h4 className="text-sm font-medium">Rango de Hora</h4>
              {(startTime || endTime) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSelection}
                  className="h-auto p-1 text-xs"
                >
                  <Trash className="h-4 w-4" />
                  Limpiar
                </Button>
              )}
            </div>

            <div className="grid gap-2">
              {timeSlots.map((time) => {
                const isStartSelected = startTime === time
                const isEndSelected = endTime === time

                let variant: 'default' | 'outline' = 'outline'
                let className = 'w-full shadow-none'

                if (isStartSelected || isEndSelected) {
                  variant = 'default'
                }
                if (isStartSelected) {
                  className += ` -top-[20px] sticky`
                }
                if (isEndSelected) {
                  className += ` -bottom-[20px] sticky`
                }

                return (
                  <Button
                    key={time}
                    data-time={time}
                    variant={variant}
                    onClick={() => handleTimeSelect(time)}
                    className={className}
                  >
                    <span className="flex items-center gap-2">
                      {time}
                      {isStartSelected && (
                        <span className="text-xs">(Inicio)</span>
                      )}
                      {isEndSelected && <span className="text-xs">(Fin)</span>}
                    </span>
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 border-t px-6 !py-5">
        <div className="text-sm">
          {date && startTime && endTime ? (
            <>
              Cita programada para{' '}
              <span className="font-medium">
                {format(date, 'EEEE, d', { locale: es })} de{' '}
                {format(date, 'MMMM', { locale: es })} de{' '}
                {format(date, 'yyyy', { locale: es })}
              </span>
              , de <span className="font-medium">{startTime}</span> a{' '}
              <span className="font-medium">{endTime}</span>
            </>
          ) : date && startTime ? (
            <>
              Fecha seleccionada:{' '}
              <span className="font-medium">
                {format(date, 'PPPP', { locale: es })}
              </span>{' '}
              a las <span className="font-medium">{startTime}</span>.
              <span className="text-muted-foreground">
                {' '}
                Ahora selecciona la hora de fin.
              </span>
            </>
          ) : date ? (
            <>
              Fecha seleccionada:{' '}
              <span className="font-medium">
                {format(date, 'PPPP', { locale: es })}
              </span>
              .
              <span className="text-muted-foreground">
                {' '}
                Selecciona la hora de inicio.
              </span>
            </>
          ) : (
            <>
              Selecciona una fecha y luego las horas de inicio y fin para tu
              cita.
            </>
          )}
        </div>

        {/* Input group con campos de tiempo */}
        <div className="flex flex-col gap-3 w-full">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="start-time" className="text-xs font-medium">
                Hora de inicio
              </Label>
              <Input
                id="start-time"
                type="time"
                value={startTime || ''}
                onChange={handleStartTimeChange}
                disabled={!date}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time" className="text-xs font-medium">
                Hora de fin
              </Label>
              <Input
                id="end-time"
                type="time"
                value={endTime || ''}
                onChange={handleEndTimeChange}
                disabled={!date || !startTime}
                className="text-sm"
              />
            </div>
          </div>

          <Button
            disabled={!date || !startTime || !endTime}
            className="w-full"
            onClick={handleContinue}
          >
            Continuar
          </Button>
        </div>
      </CardFooter>
    </Card>
  )

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <InputGroup className={className}>
          <InputGroupInput
            placeholder={placeholder}
            value={displayValue}
            readOnly
            disabled={disabled}
            className="flex-1 justify-between h-9 px-3 py-2 text-left !text-sm"
          />
          <InputGroupAddon align="inline-end">
            <CalendarIcon className="h-4 w-4" />
          </InputGroupAddon>
        </InputGroup>
      </DrawerTrigger>
      <DrawerContent className="!right-0 !left-auto max-w-3xl">
        <DrawerHeader>
          <DrawerTitle>Seleccionar fecha y horario</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-auto  mx-auto">{calendarContent}</div>
      </DrawerContent>
    </Drawer>
  )
}
