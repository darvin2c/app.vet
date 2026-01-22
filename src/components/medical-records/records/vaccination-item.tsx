'use client'

import { Item, ItemContent, ItemTitle, ItemActions } from '@/components/ui/item'
import { Tables } from '@/types/supabase.types'
import { Syringe } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

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
        <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
          {vaccination.dose && (
            <div>
              <span className="font-medium text-muted-foreground">Dosis:</span>{' '}
              {vaccination.dose}
            </div>
          )}
          {vaccination.route && (
            <div>
              <span className="font-medium text-muted-foreground">Vía:</span>{' '}
              {vaccination.route}
            </div>
          )}
          {vaccination.site && (
            <div>
              <span className="font-medium text-muted-foreground">Sitio:</span>{' '}
              {vaccination.site}
            </div>
          )}
          {vaccination.next_due_at && (
            <div>
              <span className="font-medium text-muted-foreground">
                Próxima Dosis:
              </span>{' '}
              {format(new Date(vaccination.next_due_at), 'dd/MM/yyyy', {
                locale: es,
              })}
            </div>
          )}
        </div>
        {vaccination.adverse_event && (
          <div className="mt-2 text-sm">
            <span className="font-medium text-destructive">
              Evento Adverso:
            </span>{' '}
            {vaccination.adverse_event}
          </div>
        )}
      </ItemContent>
      {/* TODO: Add VaccinationActions if needed for edit/delete */}
    </Item>
  )
}
