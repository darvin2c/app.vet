'use client'

import React, { useState } from 'react'
import { Calendar, X } from 'lucide-react'
import { format } from 'date-fns'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'

import type { DateRangeFilterConfig } from './types'

interface DateRangeFilterProps {
  config: any // Temporal para evitar errores de tipado
  fromValue: string
  toValue: string
  onChange: (from: string, to: string) => void
}

export default function DateRangeFilter({
  config,
  fromValue,
  toValue,
  onChange,
}: DateRangeFilterProps) {
  const [fromOpen, setFromOpen] = useState(false)
  const [toOpen, setToOpen] = useState(false)

  const fromDate = fromValue ? new Date(fromValue) : undefined
  const toDate = toValue ? new Date(toValue) : undefined

  const handleClear = () => {
    onChange('', '')
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{config.label}</Label>
        {(fromValue || toValue) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Popover open={fromOpen} onOpenChange={setFromOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'justify-start text-left font-normal',
                !fromDate && 'text-muted-foreground'
              )}
            >
              <Calendar className="mr-1 h-3 w-3" />
              {fromDate ? format(fromDate, 'dd/MM') : 'Desde'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={fromDate}
              onSelect={(date) => {
                onChange(date ? format(date, 'yyyy-MM-dd') : '', toValue)
                setFromOpen(false)
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Popover open={toOpen} onOpenChange={setToOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'justify-start text-left font-normal',
                !toDate && 'text-muted-foreground'
              )}
            >
              <Calendar className="mr-1 h-3 w-3" />
              {toDate ? format(toDate, 'dd/MM') : 'Hasta'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={toDate}
              onSelect={(date) => {
                onChange(fromValue, date ? format(date, 'yyyy-MM-dd') : '')
                setToOpen(false)
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
