'use client'

import { useState, useEffect } from 'react'
import { DateRange } from 'react-day-picker'
import {
  format,
  subDays,
  startOfToday,
  differenceInDays,
  isValid,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { OrderKpi } from './order-kpi'
import { AppointmentKpi } from './appointment-kpi'
import { OrderAvgKpi } from './order-avg-kpi'
import { PetNewKpi } from './pet-new-kpi'

export function KpiGrid() {
  const today = startOfToday()
  const defaultFrom = subDays(today, 6) // 7 days including today
  const defaultTo = today

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: defaultFrom,
    to: defaultTo,
  })

  const [prevRange, setPrevRange] = useState<DateRange | undefined>(undefined)

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      if (isValid(dateRange.from) && isValid(dateRange.to)) {
        const daysDiff = differenceInDays(dateRange.to, dateRange.from)
        const prevEnd = subDays(dateRange.from, 1)
        const prevStart = subDays(prevEnd, daysDiff)

        setPrevRange({
          from: prevStart,
          to: prevEnd,
        })
      }
    }
  }, [dateRange])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <div className="grid gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={'outline'}
                className={cn(
                  'w-[300px] justify-start text-left font-normal',
                  !dateRange && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, 'LLL dd, y', { locale: es })} -{' '}
                      {format(dateRange.to, 'LLL dd, y', { locale: es })}
                    </>
                  ) : (
                    format(dateRange.from, 'LLL dd, y', { locale: es })
                  )
                ) : (
                  <span>Seleccionar fechas</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                showOutsideDays={false}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dateRange?.from &&
          dateRange?.to &&
          prevRange?.from &&
          prevRange?.to && (
            <>
              <OrderKpi
                dateRange={dateRange as { from: Date; to: Date }}
                prevRange={prevRange as { from: Date; to: Date }}
              />
              <AppointmentKpi
                dateRange={dateRange as { from: Date; to: Date }}
                prevRange={prevRange as { from: Date; to: Date }}
              />
              <OrderAvgKpi
                dateRange={dateRange as { from: Date; to: Date }}
                prevRange={prevRange as { from: Date; to: Date }}
              />
              <PetNewKpi
                dateRange={dateRange as { from: Date; to: Date }}
                prevRange={prevRange as { from: Date; to: Date }}
              />
            </>
          )}
      </div>
    </div>
  )
}
