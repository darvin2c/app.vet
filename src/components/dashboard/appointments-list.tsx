'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Calendar, Clock } from 'lucide-react'

type Appointment = {
  id: string
  patientName: string
  ownerName: string
  type: string
  time: string
  status: 'confirmed' | 'pending' | 'in-progress'
  avatar?: string
}

const appointments: Appointment[] = [
  {
    id: '1',
    patientName: 'Max',
    ownerName: 'Carla Middler',
    type: 'Consulta General',
    time: '08:00 - 08:30',
    status: 'pending',
  },
  {
    id: '2',
    patientName: 'Luna',
    ownerName: 'Edward Johnson',
    type: 'Limpieza Dental',
    time: '08:30 - 09:00',
    status: 'confirmed',
  },
  {
    id: '3',
    patientName: 'Rocky',
    ownerName: 'Ellie Rogers',
    type: 'Rayos X',
    time: '09:30 - 10:00',
    status: 'in-progress',
  },
  {
    id: '4',
    patientName: 'Coco',
    ownerName: 'Lily Brown',
    type: 'Vacunación',
    time: '10:30 - 11:00',
    status: 'pending',
  },
]

export function AppointmentsList() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Próximas Citas</CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10 rounded-lg">
                <AvatarImage src={apt.avatar} alt={apt.patientName} />
                <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                  {apt.patientName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {apt.patientName}
                  <span className="text-muted-foreground font-normal ml-2">
                    ({apt.ownerName})
                  </span>
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1 py-0 h-5 font-normal"
                  >
                    {apt.type}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {apt.time}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div
                className={`h-2 w-2 rounded-full ${
                  apt.status === 'confirmed'
                    ? 'bg-green-500'
                    : apt.status === 'in-progress'
                      ? 'bg-blue-500'
                      : 'bg-orange-500'
                }`}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
