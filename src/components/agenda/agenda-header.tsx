'use client'

import { useIlamyCalendarContext } from '@ilamy/calendar'
import { Button } from '../ui/button'
import { ChevronLeft, ChevronRight, Circle } from 'lucide-react'
import { ButtonGroup } from '../ui/button-group'
import { DropdownMenu } from '@radix-ui/react-dropdown-menu'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { AppointmentCreateButton } from '../appointments/appointment-create-button'
import dayjs, { Dayjs } from 'dayjs'
import { useEffect } from 'react'
import { ResponsiveButton } from '../ui/responsive-button'
import { useIsMobile } from '@/hooks/use-mobile'
import { SidebarTrigger } from '@/components/ui/multi-sidebar'

export default function AgendaHeader({
  initialDate,
  initialView,
}: {
  initialDate: Dayjs
  initialView: 'month' | 'week' | 'day' | 'year'
}) {
  const isMobile = useIsMobile()

  useEffect(() => {
    if (currentDate.format('YYYY-MM-DD') !== initialDate.format('YYYY-MM-DD')) {
      setCurrentDate(initialDate)
    }
  }, [initialDate])

  useEffect(() => {}, [initialView])
  const { view, setView, nextPeriod, prevPeriod, currentDate, setCurrentDate } =
    useIlamyCalendarContext()
  return (
    <div className="flex items-center justify-between pb-4 bg-background border-b border-border">
      {isMobile && (
        <SidebarTrigger
          variant="outline"
          className="cursor-ew-resize h-8 w-8"
        />
      )}
      <ButtonGroup>
        <ResponsiveButton
          variant="outline"
          size="sm"
          onClick={() => prevPeriod()}
          icon={ChevronLeft}
        >
          Anterior
        </ResponsiveButton>
        <ResponsiveButton
          variant="outline"
          icon={Circle}
          size="sm"
          onClick={() => setCurrentDate(dayjs())}
        >
          Hoy
        </ResponsiveButton>
        <ResponsiveButton
          variant="outline"
          size="sm"
          onClick={() => nextPeriod()}
          icon={ChevronRight}
        >
          Siguiente
        </ResponsiveButton>
      </ButtonGroup>
      <div>
        <span className="text-sm font-semibold text-foreground">
          {currentDate.format('MMMM YYYY')}
        </span>
      </div>
      <div>
        <div className="flex items-center gap-2">
          {/* Desktop: full ButtonGroup */}
          <div className="hidden md:flex">
            <ButtonGroup>
              <Button
                variant={view === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('month')}
              >
                Mes
              </Button>
              <Button
                variant={view === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('week')}
              >
                Semana
              </Button>
              <Button
                variant={view === 'day' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('day')}
              >
                Día
              </Button>
              <Button
                variant={view === 'year' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('year')}
              >
                Año
              </Button>
            </ButtonGroup>
          </div>

          {/* Mobile: show only selected view + dropdown */}
          <ButtonGroup className="md:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setView(view)} // current view button
            >
              {view === 'month' && 'Mes'}
              {view === 'week' && 'Semana'}
              {view === 'day' && 'Día'}
              {view === 'year' && 'Año'}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="px-2">
                  <span className="sr-only">Cambiar vista</span>⋯
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setView('month')}>
                  Mes
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setView('week')}>
                  Semana
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setView('day')}>
                  Día
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setView('year')}>
                  Año
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
          <AppointmentCreateButton />
        </div>
      </div>
    </div>
  )
}
