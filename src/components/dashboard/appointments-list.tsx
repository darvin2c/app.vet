'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAppointmentList } from '@/hooks/appointments/use-appointment-list'
import { Clock, Eye, MoreHorizontal } from 'lucide-react'
import { format } from 'date-fns'
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
  ItemTitle,
} from '@/components/ui/item'

export function AppointmentsList() {
  const now = new Date()
  const { data: appointments } = useAppointmentList({
    filters: [
      { field: 'scheduled_start', operator: 'gte', value: now.toISOString() },
    ],
  })

  const { statusList, getStatus } = useAppointmentStatus()

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium">Próximas Citas</CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          {appointments?.map((apt) => {
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

            const startTime = format(new Date(apt.scheduled_start), 'HH:mm', {
              locale: es,
            })
            const endTime = format(new Date(apt.scheduled_end), 'HH:mm', {
              locale: es,
            })
            const timeRange = `${startTime} - ${endTime}`

            return (
              <EventCard key={apt.id} appointment={apt}>
                <Item className="hover:bg-muted/50 transition-colors cursor-pointer">
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
                    </ItemTitle>
                    <ItemDescription>
                      {typeName} • {timeRange}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
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
                  </ItemActions>
                </Item>
              </EventCard>
            )
          })}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
