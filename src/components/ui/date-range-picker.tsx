'use client'

import * as React from 'react'
import { format, startOfToday, subDays, differenceInDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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

interface DateRangePickerProps {
  date?: DateRange
  onDateChange?: (date: DateRange | undefined) => void
  className?: string
}

export function DateRangePicker({
  date,
  onDateChange,
  className,
}: DateRangePickerProps) {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)

  const handlePresetSelect = (days: number) => {
    const to = startOfToday()
    const from = subDays(to, days - 1)
    onDateChange?.({ from, to })
    setOpen(false)
  }

  const Presets = () => (
    <div
      className={cn(
        'flex flex-col gap-2',
        isMobile ? 'p-4' : 'p-3 border-r border-border'
      )}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handlePresetSelect(7)}
        className={cn(
          'justify-start font-normal',
          date?.from && date?.to && differenceInDays(date.to, date.from) === 6
            ? 'bg-accent text-accent-foreground'
            : ''
        )}
      >
        Últimos 7 días
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handlePresetSelect(30)}
        className={cn(
          'justify-start font-normal',
          date?.from && date?.to && differenceInDays(date.to, date.from) === 29
            ? 'bg-accent text-accent-foreground'
            : ''
        )}
      >
        Últimos 30 días
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handlePresetSelect(90)}
        className={cn(
          'justify-start font-normal',
          date?.from && date?.to && differenceInDays(date.to, date.from) === 89
            ? 'bg-accent text-accent-foreground'
            : ''
        )}
      >
        Últimos 3 meses
      </Button>
    </div>
  )

  const TriggerButton = (
    <Button
      id="date"
      variant={'outline'}
      className={cn(
        'w-full justify-start text-left font-normal',
        !date && 'text-muted-foreground',
        className
      )}
    >
      <CalendarIcon className="mr-2 h-4 w-4" />
      {date?.from ? (
        date.to ? (
          <>
            {format(date.from, 'LLL dd, y', { locale: es })} -{' '}
            {format(date.to, 'LLL dd, y', { locale: es })}
          </>
        ) : (
          format(date.from, 'LLL dd, y', { locale: es })
        )
      ) : (
        <span>Seleccionar fechas</span>
      )}
    </Button>
  )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{TriggerButton}</SheetTrigger>
        <SheetContent side="bottom" className="p-0">
          <SheetHeader className="p-4 pb-0 text-left">
            <SheetTitle>Seleccionar rango</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col">
            <Presets />
            <div className="p-4 pt-0 flex justify-center">
              <Calendar
                mode="range"
                className="w-full"
                defaultMonth={date?.from}
                selected={date}
                onSelect={onDateChange}
                numberOfMonths={1}
                showOutsideDays={false}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{TriggerButton}</PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <div className="flex">
          <Presets />
          <div className="p-0">
            <Calendar
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={onDateChange}
              numberOfMonths={2}
              showOutsideDays={false}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
