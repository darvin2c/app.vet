'use client'

import { Item, ItemContent, ItemTitle } from '@/components/ui/item'
import { Tables } from '@/types/supabase.types'
import { Package } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export type MedicalRecordItemWithProduct = Tables<'record_items'> & {
  products: Tables<'products'> | null
}

export default function RecordItemItem({
  recordItem,
}: {
  recordItem: MedicalRecordItemWithProduct
}) {
  return (
    <Item key={recordItem.id} variant="muted" size="sm">
      <ItemContent>
        <ItemTitle className="text-sm flex items-center gap-2">
          <Package className="h-3 w-3 text-purple-500" />
          <span>{recordItem.products?.name || 'Producto/Servicio'}</span>
          <Badge variant="outline" className="text-xs">
            {format(new Date(recordItem.created_at), 'dd/MM/yyyy HH:mm', {
              locale: es,
            })}
          </Badge>
        </ItemTitle>
        <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-muted-foreground">Cantidad:</span>{' '}
            {recordItem.qty}
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Precio:</span>{' '}
            {new Intl.NumberFormat('es-PE', {
              style: 'currency',
              currency: 'PEN',
            }).format(recordItem.unit_price)}
          </div>
          {recordItem.discount && recordItem.discount > 0 && (
            <div>
              <span className="font-medium text-muted-foreground">Descuento:</span>{' '}
              {new Intl.NumberFormat('es-PE', {
                style: 'currency',
                currency: 'PEN',
              }).format(recordItem.discount)}
            </div>
          )}
          <div className="col-span-2">
            <span className="font-medium text-muted-foreground">Total:</span>{' '}
            {new Intl.NumberFormat('es-PE', {
              style: 'currency',
              currency: 'PEN',
            }).format(
              recordItem.qty * recordItem.unit_price - (recordItem.discount || 0)
            )}
          </div>
        </div>
        {recordItem.notes && (
          <div className="mt-2 text-sm">
            <span className="font-medium text-muted-foreground">Notas:</span>{' '}
            {recordItem.notes}
          </div>
        )}
      </ItemContent>
    </Item>
  )
}
