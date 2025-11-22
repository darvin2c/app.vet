'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronDown } from 'lucide-react'

interface SummaryCardProps {
  petName: string
  clientName: string
  startDate: Date
  endDate: Date
  appointmentTypeName: string
  staffName?: string
  typeColor?: string
  defaultOpen?: boolean
  className?: string
}

export default function SummaryCard({
  petName,
  clientName,
  startDate,
  endDate,
  appointmentTypeName,
  staffName,
  typeColor = '#3B82F6',
  defaultOpen = false,
  className,
}: SummaryCardProps) {
  return (
    <Collapsible defaultOpen={defaultOpen}>
      <CollapsibleTrigger asChild>
        <Card
          className={
            (className || '') +
            ' rounded-lg border bg-muted/20 p-3 cursor-pointer'
          }
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">
                {format(startDate, 'dd/MM/yyyy', { locale: es })}
              </Badge>
              <Badge variant="outline">
                {format(startDate, 'HH:mm', { locale: es })} -{' '}
                {format(endDate, 'HH:mm', { locale: es })}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ backgroundColor: typeColor }}
                  aria-hidden="true"
                />
                {appointmentTypeName}
              </Badge>
              <Badge variant="outline">{petName}</Badge>
              <Badge variant="outline">{clientName}</Badge>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </Card>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Card className="mt-3 rounded-lg border bg-background p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
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
            <div className="col-span-1 sm:col-span-2">
              <div className="text-muted-foreground">Tipo</div>
              <div className="font-semibold flex items-center gap-2">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ backgroundColor: typeColor }}
                />
                {appointmentTypeName}
              </div>
            </div>
            {staffName && (
              <div className="col-span-1 sm:col-span-2">
                <div className="text-muted-foreground">Personal</div>
                <div className="font-semibold">{staffName}</div>
              </div>
            )}
          </div>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  )
}
