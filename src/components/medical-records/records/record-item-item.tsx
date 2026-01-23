'use client'

import { Item, ItemContent, ItemTitle, ItemActions } from '@/components/ui/item'
import { Tables } from '@/types/supabase.types'
import { Package } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { MedicalRecordItemActions } from '@/components/medical-record-items/medical-record-item-actions'

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
          <Package className="h-3 w-3 text-blue-500" />
          <span>{recordItem.products?.name || 'Producto desconocido'}</span>
          <Badge variant="outline" className="text-xs">
            {format(new Date(recordItem.created_at), 'dd/MM/yyyy HH:mm', {
              locale: es,
            })}
          </Badge>
        </ItemTitle>
        <div className="mt-2 grid grid-cols-2 gap-x-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cantidad:</span>
            <span>{recordItem.qty}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Precio Unit.:</span>
            <span>
              {new Intl.NumberFormat('es-PE', {
                style: 'currency',
                currency: 'PEN',
              }).format(recordItem.unit_price)}
            </span>
          </div>
          {(recordItem.discount || 0) > 0 && (
            <div className="flex justify-between text-destructive">
              <span>Descuento:</span>
              <span>
                -
                {new Intl.NumberFormat('es-PE', {
                  style: 'currency',
                  currency: 'PEN',
                }).format(recordItem.discount || 0)}
              </span>
            </div>
          )}
        </div>
        {recordItem.notes && (
          <div className="mt-2 text-xs text-muted-foreground">
            Nota: {recordItem.notes}
          </div>
        )}
      </ItemContent>
      <ItemActions>
        <MedicalRecordItemActions medicalRecordItem={recordItem} />
      </ItemActions>
    </Item>
  )
}
