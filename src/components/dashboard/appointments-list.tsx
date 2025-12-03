'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAppointmentList } from '@/hooks/appointments/use-appointment-list'
import {
  Clock,
  MoreHorizontal,
  Plus,
  Calendar as CalendarIcon,
  RefreshCcw,
  Calendar,
} from 'lucide-react'
import { format, formatRelative } from 'date-fns'
import { es } from 'date-fns/locale'
import useAppointmentStatus from '@/hooks/appointments/use-appointment-status'
import { EventCard } from '../agenda/event-card'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { AppointmentCreate } from '../appointments/appointment-create'
import { TableSkeleton } from '../ui/table-skeleton'
import { Spinner } from '../ui/spinner'
import { AppliedFilter } from '../ui/filters'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '../ui/empty'
import { AppointmentCreateButton } from '../appointments/appointment-create-button'

export function AppointmentsList() {
  const [createOpen, setCreateOpen] = useState(false)

  // Memoizamos los filtros para evitar recrearlos en cada render
  // Usamos startOfDay para que la fecha sea estable durante el día
  const filters: AppliedFilter[] = useMemo(() => {
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)
    return [
      {
        field: 'scheduled_start',
        operator: 'gte',
        value: startOfDay.toISOString(),
      },
    ]
  }, []) // Dependencias vacías para que solo se cree una vez al montar

  const {
    data: appointments,
    refetch,
    isPending,
    isRefetching,
  } = useAppointmentList({
    filters,
  })

  const { statusList, getStatus } = useAppointmentStatus()

  if (isPending) {
    return <TableSkeleton variant="list" />
  }

  if (appointments?.length == 0) {
    return (
      <Card className="shadow-sm">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </EmptyMedia>
            <EmptyTitle>No Citas Programadas</EmptyTitle>
            <EmptyDescription>
              No tienes citas programadas pendientes.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <AppointmentCreateButton />
            </div>
          </EmptyContent>
        </Empty>
      </Card>
    )
  }

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-medium">
            Próximas Citas
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                {isRefetching ? (
                  <Spinner className="h-4 w-4" />
                ) : (
                  <MoreHorizontal className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Cita
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/agenda">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Ver Agenda
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => refetch()}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Recargar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="pt-2">
          <ItemGroup>
            {appointments?.map((apt, index) => {
              const pet = apt.pets
              const client = pet?.customers
              const appointmentType = apt.appointment_types
              const status = apt.status || 'scheduled'

              const petName = pet?.name || '-'
              const clientName = client
                ? `${client.first_name} ${client.last_name}`
                : 'Sin cliente'
              const typeName = appointmentType?.name || '-'
              const typeColor = appointmentType?.color || '#3b82f6'

              const statusColor =
                statusList.find((s) => s.value === status)?.color || '#64748b'
              const statusLabel = getStatus(status)

              const start = new Date(apt.scheduled_start)
              const end = new Date(apt.scheduled_end)

              let dateText = formatRelative(start, new Date(), { locale: es })
              // Capitalize first letter
              dateText = dateText.charAt(0).toUpperCase() + dateText.slice(1)

              const endTime = format(end, 'p', {
                locale: es,
              })
              const timeRange = `${dateText} - ${endTime}`

              return (
                <EventCard key={apt.id} appointment={apt}>
                  <Item className="hover:bg-muted/50 transition-colors cursor-pointer px-0">
                    <ItemMedia>
                      <div
                        className="flex h-3 w-3 items-center justify-center rounded-full border"
                        style={{
                          backgroundColor: `${typeColor}`,
                          borderColor: typeColor,
                          color: typeColor,
                        }}
                      ></div>
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>
                        {petName}
                        <span className="ml-2 font-normal text-muted-foreground">
                          ({clientName})
                        </span>
                        <Badge
                          variant="outline"
                          style={{
                            borderColor: statusColor,
                            color: statusColor,
                            backgroundColor: `${statusColor}10`,
                          }}
                        >
                          {statusLabel}
                        </Badge>
                      </ItemTitle>
                      <ItemDescription>
                        {typeName} • {timeRange}
                      </ItemDescription>
                    </ItemContent>
                  </Item>
                  {index < appointments.length - 1 && <ItemSeparator />}
                </EventCard>
              )
            })}
          </ItemGroup>
        </CardContent>
      </Card>

      <AppointmentCreate
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={() => refetch()}
      />
    </>
  )
}
