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
          <Package className="h-3 w-3 text-purple-500" />
          <span>{recordItem.products?.name || 'Producto/Servicio'}</span>
          <Badge variant="outline" className="text-xs">
            {format(new Date(recordItem.created_at), 'dd/MM/yyyy HH:mm', {
              locale: es,
            })}
          </Badge>
        </ItemTitle>
        <dl className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div className="flex flex-row items-baseline justify-between sm:justify-start sm:gap-2">
            <dt className="text-xs font-medium text-muted-foreground">
              Cantidad:
            </dt>
            <dd className="text-sm font-medium">{recordItem.qty}</dd>
          </div>
          <div className="flex flex-row items-baseline justify-between sm:justify-start sm:gap-2">
            <dt className="text-xs font-medium text-muted-foreground">
              Precio:
            </dt>
            <dd className="text-sm font-medium">
              {new Intl.NumberFormat('es-PE', {
                style: 'currency',
                currency: 'PEN',
              }).format(recordItem.unit_price)}
            </dd>
          </div>
          {recordItem.discount && recordItem.discount > 0 && (
            <div className="flex flex-row items-baseline justify-between sm:justify-start sm:gap-2">
              <dt className="text-xs font-medium text-muted-foreground">
                Descuento:
              </dt>
              <dd className="text-sm font-medium">
                {new Intl.NumberFormat('es-PE', {
                  style: 'currency',
                  currency: 'PEN',
                }).format(recordItem.discount)}
              </dd>
            </div>
          )}
          <div className="col-span-1 sm:col-span-2 flex flex-row items-baseline justify-between sm:justify-start sm:gap-2">
            <dt className="text-xs font-medium text-muted-foreground">
              Total:
            </dt>
            <dd className="text-sm font-medium">
              {new Intl.NumberFormat('es-PE', {
                style: 'currency',
                currency: 'PEN',
              }).format(
                recordItem.qty * recordItem.unit_price -
                  (recordItem.discount || 0)
              )}
            </dd>
          </div>
        </dl>
        {recordItem.notes && (
          <div className="mt-2 flex flex-col sm:flex-row sm:gap-2 items-start sm:items-baseline">
            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
              Notas:
            </span>
            <span className="text-sm">{recordItem.notes}</span>
          </div>
        )}
      </ItemContent>
      <ItemActions>
        <MedicalRecordItemActions medicalRecordItem={recordItem} />
      </ItemActions>
    </Item>
  )
}
