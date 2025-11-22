'use client'

import { Card } from '@/components/ui/card'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface SummaryCardProps {
  petName: string
  clientName: string
  startDate: Date
  endDate: Date
  appointmentTypeName: string
  className?: string
}

export default function SummaryCard({
  petName,
  clientName,
  startDate,
  endDate,
  appointmentTypeName,
  className,
}: SummaryCardProps) {
  return (
    <Card className={className + ' rounded-lg border bg-muted/30 p-4'}>
      <div className="text-sm font-medium mb-2">Resumen de la Cita</div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-muted-foreground">Mascota</div>
          <div className="font-semibold">{petName}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Cliente</div>
          <div className="font-semibold">{clientName}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Fecha</div>
          <div className="font-semibold">
            {format(startDate, 'dd/MM/yyyy', { locale: es })}
          </div>
        </div>
        <div>
          <div className="text-muted-foreground">Horario</div>
          <div className="font-semibold">
            {format(startDate, 'HH:mm', { locale: es })} -{' '}
            {format(endDate, 'HH:mm', { locale: es })}
          </div>
        </div>
        <div className="col-span-2">
          <div className="text-muted-foreground">Tipo</div>
          <div className="font-semibold">{appointmentTypeName}</div>
        </div>
      </div>
    </Card>
  )
}
