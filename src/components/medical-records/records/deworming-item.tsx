'use client'

import { Item, ItemContent, ItemTitle, ItemActions } from '@/components/ui/item'
import { Tables } from '@/types/supabase.types'
import { Pill } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { DewormingActions } from '../deworming-actions'

export default function DewormingItem({
  deworming,
}: {
  deworming: Tables<'pet_dewormings'> & {
    products?: Tables<'products'> | null
  }
}) {
  return (
    <Item key={deworming.id} variant="muted" size="sm">
      <ItemContent>
        <ItemTitle className="text-sm flex items-center gap-2">
          <Pill className="h-3 w-3 text-purple-500" />
          <span>Desparasitación</span>
          <Badge variant="outline" className="text-xs">
            {format(new Date(deworming.created_at), 'dd/MM/yyyy HH:mm', {
              locale: es,
            })}
          </Badge>
        </ItemTitle>
        <dl className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
          {deworming.products && (
            <div className="flex flex-row items-baseline justify-between sm:justify-start sm:gap-2">
              <dt className="text-xs font-medium text-muted-foreground">
                Producto:
              </dt>
              <dd className="text-sm font-medium">{deworming.products.name}</dd>
            </div>
          )}
          {deworming.dose && (
            <div className="flex flex-row items-baseline justify-between sm:justify-start sm:gap-2">
              <dt className="text-xs font-medium text-muted-foreground">
                Dosis:
              </dt>
              <dd className="text-sm font-medium">{deworming.dose}</dd>
            </div>
          )}
          {deworming.route && (
            <div className="flex flex-row items-baseline justify-between sm:justify-start sm:gap-2">
              <dt className="text-xs font-medium text-muted-foreground">
                Vía:
              </dt>
              <dd className="text-sm font-medium">{deworming.route}</dd>
            </div>
          )}
          {deworming.next_due_at && (
            <div className="flex flex-row items-baseline justify-between sm:justify-start sm:gap-2">
              <dt className="text-xs font-medium text-muted-foreground">
                Próxima Dosis:
              </dt>
              <dd className="text-sm font-medium">
                {format(new Date(deworming.next_due_at), 'dd/MM/yyyy', {
                  locale: es,
                })}
              </dd>
            </div>
          )}
        </dl>
        {deworming.adverse_event && (
          <div className="mt-2 flex flex-col sm:flex-row sm:gap-2 items-start sm:items-baseline">
            <span className="text-xs font-medium text-destructive whitespace-nowrap">
              Evento Adverso:
            </span>
            <span className="text-sm">{deworming.adverse_event}</span>
          </div>
        )}
      </ItemContent>
      <ItemActions>
        <DewormingActions deworming={deworming} />
      </ItemActions>
    </Item>
  )
}
