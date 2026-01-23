'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePendingBillingItems } from '@/hooks/medical-record-items/use-pending-billing-items'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { FormSheet } from '@/components/ui/form-sheet'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Loader2, AlertCircle, ShoppingCart } from 'lucide-react'
import { CurrencyDisplay } from '@/components/ui/currency-input'
import useOrderCreate from '@/hooks/orders/use-order-create'
import { toast } from 'sonner'
import { TablesInsert } from '@/types/supabase.types'

interface PendingBillingItemsProps {
  petId: string
}

const billingSchema = z.object({
  selectedItems: z
    .array(z.string())
    .min(1, 'Debe seleccionar al menos un ítem'),
})

type BillingFormValues = z.infer<typeof billingSchema>

export function PendingBillingItems({ petId }: PendingBillingItemsProps) {
  const { data: items, isLoading, error } = usePendingBillingItems(petId)
  const [isOpen, setIsOpen] = useState(false)
  const orderCreate = useOrderCreate()

  const form = useForm<BillingFormValues>({
    resolver: zodResolver(billingSchema),
    defaultValues: {
      selectedItems: [],
    },
  })

  if (isLoading) return null
  if (error || !items || items.length === 0) return null

  const onSubmit = async (data: BillingFormValues) => {
    try {
      const selectedItemsData = items.filter((item) =>
        data.selectedItems.includes(item.id)
      )

      if (selectedItemsData.length === 0) return

      // Calcular totales
      const subtotal = selectedItemsData.reduce(
        (sum, item) => sum + item.unit_price * item.qty,
        0
      )
      const tax = subtotal * 0.18 // Asumiendo IGV 18%
      const total = subtotal + tax

      // Crear la orden
      const order: Omit<TablesInsert<'orders'>, 'tenant_id'> = {
        pet_id: petId,
        tax: 18,
        total,
        paid_amount: 0,
      }

      const orderItems: Omit<
        TablesInsert<'order_items'>,
        'tenant_id' | 'order_id'
      >[] = selectedItemsData.map((item) => ({
        product_id: item.product_id,
        quantity: item.qty,
        price_base: item.unit_price,
        discount: 0,
        description: item.products?.name || 'Ítem sin nombre',
      }))

      await orderCreate.mutateAsync({
        order,
        items: orderItems,
        payments: [],
      })

      // Aquí deberíamos actualizar los record_items con el ID de los order_items creados
      // Pero eso requiere que la API de creación de orden devuelva los IDs de los items creados
      // O hacer un paso adicional en el backend (trigger o función RPC)

      toast.success('Orden creada exitosamente')
      setIsOpen(false)
    } catch (error) {
      console.error('Error creating order:', error)
      toast.error('Error al crear la orden')
    }
  }

  const toggleSelectAll = () => {
    const currentSelected = form.getValues('selectedItems')
    if (currentSelected.length === items.length) {
      form.setValue('selectedItems', [])
    } else {
      form.setValue(
        'selectedItems',
        items.map((item) => item.id)
      )
    }
  }

  const selectedCount = form.watch('selectedItems').length

  return (
    <>
      <Alert className="mb-6 border-orange-200 bg-orange-50 dark:bg-orange-950/10 dark:border-orange-900">
        <ShoppingCart className="h-4 w-4 text-orange-600 dark:text-orange-400" />
        <AlertTitle className="text-orange-800 dark:text-orange-400 ml-2">
          Pendiente de Facturar
        </AlertTitle>
        <AlertDescription className="flex items-center justify-between mt-2">
          <span className="text-orange-800/80 dark:text-orange-400/80">
            Hay {items.length} ítems pendientes de facturación para esta
            mascota.
          </span>
          <Button
            size="sm"
            variant="outline"
            className="border-orange-200 text-orange-700 hover:bg-orange-100 hover:text-orange-800 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-900/30"
            onClick={() => {
              setIsOpen(true)
              // Pre-seleccionar todos los items al abrir
              form.setValue(
                'selectedItems',
                items.map((item) => item.id)
              )
            }}
          >
            Facturar Ahora
          </Button>
        </AlertDescription>
      </Alert>

      <FormSheet
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Facturar Ítems Pendientes"
        description="Selecciona los ítems que deseas incluir en la orden de venta."
        form={form}
        onSubmit={onSubmit}
        submitLabel="Generar Orden"
        className="!max-w-3xl"
      >
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={
                        items.length > 0 && selectedCount === items.length
                      }
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Cant.</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox
                        checked={form.watch('selectedItems').includes(item.id)}
                        onCheckedChange={(checked) => {
                          const current = form.getValues('selectedItems')
                          if (checked) {
                            form.setValue('selectedItems', [
                              ...current,
                              item.id,
                            ])
                          } else {
                            form.setValue(
                              'selectedItems',
                              current.filter((id) => id !== item.id)
                            )
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                      {format(new Date(item.created_at), 'dd/MM/yyyy', {
                        locale: es,
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {item.products?.name || 'Ítem sin nombre'}
                      </div>
                      {item.notes && (
                        <div className="text-xs text-muted-foreground">
                          {item.notes}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {item.clinical_records?.record_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{item.qty}</TableCell>
                    <TableCell className="text-right">
                      <CurrencyDisplay value={item.unit_price} />
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      <CurrencyDisplay value={item.unit_price * item.qty} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end items-center gap-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {selectedCount} ítems seleccionados
            </div>
            <div className="text-lg font-bold">
              Total:{' '}
              <CurrencyDisplay
                value={items
                  .filter((item) =>
                    form.watch('selectedItems').includes(item.id)
                  )
                  .reduce((sum, item) => sum + item.unit_price * item.qty, 0)}
              />
            </div>
          </div>
        </div>
      </FormSheet>
    </>
  )
}
