'use client'

import { useState, useEffect } from 'react'
import { DateRange } from 'react-day-picker'
import { subDays, startOfToday, differenceInDays, isValid } from 'date-fns'
import { OrderKpi } from './order-kpi'
import { AppointmentKpi } from './appointment-kpi'
import { OrderAvgKpi } from './order-avg-kpi'
import { PetNewKpi } from './pet-new-kpi'
import { DateRangePicker } from '@/components/ui/date-range-picker'

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
      <div className="flex items-center justify-end gap-2">
        <div className="w-full sm:w-[300px]">
          <DateRangePicker date={dateRange} onDateChange={setDateRange} />
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
