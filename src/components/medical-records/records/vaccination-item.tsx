'use client'

import { Item, ItemContent, ItemTitle, ItemActions } from '@/components/ui/item'
import { Tables } from '@/types/supabase.types'
import { Syringe } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { VaccinationActions } from '../vaccination-actions'

export default function VaccinationItem({
  vaccination,
}: {
  vaccination: Tables<'vaccinations'>
}) {
  return (
    <Item key={vaccination.id} variant="muted" size="sm">
      <ItemContent>
        <ItemTitle className="text-sm flex items-center gap-2">
          <Syringe className="h-3 w-3 text-blue-500" />
          <span>Vacunación</span>
          <Badge variant="outline" className="text-xs">
            {format(new Date(vaccination.created_at), 'dd/MM/yyyy HH:mm', {
              locale: es,
            })}
          </Badge>
        </ItemTitle>
        <dl className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
          {vaccination.dose && (
            <div className="flex flex-row items-baseline justify-between sm:justify-start sm:gap-2">
              <dt className="text-xs font-medium text-muted-foreground">
                Dosis:
              </dt>
              <dd className="text-sm font-medium">{vaccination.dose}</dd>
            </div>
          )}
          {vaccination.route && (
            <div className="flex flex-row items-baseline justify-between sm:justify-start sm:gap-2">
              <dt className="text-xs font-medium text-muted-foreground">Vía:</dt>
              <dd className="text-sm font-medium">{vaccination.route}</dd>
            </div>
          )}
          {vaccination.site && (
            <div className="flex flex-row items-baseline justify-between sm:justify-start sm:gap-2">
              <dt className="text-xs font-medium text-muted-foreground">
                Sitio:
              </dt>
              <dd className="text-sm font-medium">{vaccination.site}</dd>
            </div>
          )}
          {vaccination.next_due_at && (
            <div className="flex flex-row items-baseline justify-between sm:justify-start sm:gap-2">
              <dt className="text-xs font-medium text-muted-foreground">
                Próxima Dosis:
              </dt>
              <dd className="text-sm font-medium">
                {format(new Date(vaccination.next_due_at), 'dd/MM/yyyy', {
                  locale: es,
                })}
              </dd>
            </div>
          )}
        </dl>
        {vaccination.adverse_event && (
          <div className="mt-2 flex flex-col sm:flex-row sm:gap-2 items-start sm:items-baseline">
            <span className="text-xs font-medium text-destructive whitespace-nowrap">
              Evento Adverso:
            </span>
            <span className="text-sm">{vaccination.adverse_event}</span>
          </div>
        )}
      </ItemContent>
      <ItemActions>
        <VaccinationActions vaccination={vaccination} />
      </ItemActions>
    </Item>
  )
}
