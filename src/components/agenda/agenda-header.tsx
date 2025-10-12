'use client'

import { useIlamyCalendarContext } from '@ilamy/calendar'
import { Button } from '../ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ButtonGroup } from '../ui/button-group'
import { DropdownMenu } from '@radix-ui/react-dropdown-menu'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { AppointmentCreateButton } from '../appointments/appointment-create-button'

export default function AgendaHeader() {
  const { view, setView, nextPeriod, prevPeriod, currentDate } =
    useIlamyCalendarContext()
  return (
    <div className="flex items-center justify-between p-4 bg-background border-b border-border">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => prevPeriod()}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>

        <h2 className="text-lg font-semibold text-foreground">
          {currentDate.format('MMMM YYYY')}
        </h2>

        <Button
          variant="outline"
          size="sm"
          onClick={() => nextPeriod()}
          className="flex items-center gap-2"
        >
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </Button>
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
