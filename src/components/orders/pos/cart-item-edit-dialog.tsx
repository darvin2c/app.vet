'use client'

import { useEffect, useMemo } from 'react'
import {
  useForm,
  useFormContext,
  FormProvider,
  Controller,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Package, Calculator } from 'lucide-react'
import { usePOSStore } from '@/hooks/pos/use-pos-store'
import {
  cartItemEditSchema,
  CartItemEditSchema,
  calculateCartItemTotal,
} from '@/schemas/cart-item-edit.schema'
import { TablesInsert, Tables } from '@/types/supabase.types'
import { CurrencyInput } from '@/components/ui/current-input'
import { maskitoParseNumber } from '@maskito/kit'

type OrderItem = Omit<TablesInsert<'order_items'>, 'tenant_id' | 'order_id'> & {
  product?: Tables<'products'>
}

interface CartItemEditDialogProps {
  item: OrderItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function CartItemEditForm({ item }: { item: OrderItem }) {
  const form = useFormContext()

  const {
    formState: { errors },
    watch,
  } = form

  // Watch form values for real-time calculations
  const quantity = watch('quantity')
  const unit_price = watch('unit_price')
  const discount = watch('discount')

  // Calculate totals in real-time
  const calculations = useMemo(() => {
    return calculateCartItemTotal({
      quantity,
      unit_price,
      discount,
    })
  }, [quantity, unit_price, discount])

  return (
    <div className="space-y-4">
      {/* Información del producto */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">
            {item.product?.name || item.description}
          </h4>
          <Badge variant="secondary">SKU: {item.product?.sku || 'N/A'}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Precio original: S/{' '}
          {item.product?.price?.toFixed(2) ||
            item.price_base?.toFixed(2) ||
            '0.00'}
        </p>
      </div>

      <Separator />

      {/* Campos editables */}
      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="quantity">Cantidad</FieldLabel>
          <FieldContent>
            <Input
              id="quantity"
              type="number"
              min="1"
              max="999"
              {...form.register('quantity', { valueAsNumber: true })}
            />
            <FieldError errors={[errors.quantity]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="unit_price">Precio Unitario</FieldLabel>
          <FieldContent>
            <Controller
              name="unit_price"
              control={form.control}
              render={({ field }) => (
                <CurrencyInput id="unit_price" {...field} />
              )}
            />
            <FieldError errors={[errors.unit_price]} />
          </FieldContent>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="discount">Descuento (%)</FieldLabel>
        <FieldContent>
          <Input
            id="discount"
            type="number"
            min="0"
            max="100"
            step="0.1"
            {...form.register('discount', { valueAsNumber: true })}
          />
          <FieldError errors={[errors.discount]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="description">
          Descripción personalizada (opcional)
        </FieldLabel>
        <FieldContent>
          <Textarea
            id="description"
            placeholder="Agregar notas o descripción personalizada..."
            className="resize-none"
            rows={3}
            {...form.register('description')}
          />
          <FieldError errors={[errors.description]} />
        </FieldContent>
      </Field>

      {/* Cálculos en tiempo real */}
      <div className="bg-muted/50 p-3 rounded-lg space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Calculator className="h-4 w-4" />
          Cálculos
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>S/ {calculations.subtotal.toFixed(2)}</span>
          </div>
          {calculations.discountAmount > 0 && (
            <div className="flex justify-between text-red-600">
              <span>Descuento:</span>
              <span>-S/ {calculations.discountAmount.toFixed(2)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-medium">
            <span>Total:</span>
            <span>S/ {calculations.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CartItemEditDialog({
  item,
  open,
  onOpenChange,
}: CartItemEditDialogProps) {
  const { updateOrderItem } = usePOSStore()

  const form = useForm({
    resolver: zodResolver(cartItemEditSchema),
    defaultValues: {
      quantity: 1,
      unit_price: 0,
      discount: 0,
      description: '',
    },
  })

  // Update form when item changes
  useEffect(() => {
    if (item && open) {
      form.reset({
        quantity: item.quantity || 1,
        unit_price: item.unit_price || item.price_base || 0,
        discount: item.discount || 0,
        description: item.description || '',
      })
    }
  }, [item, open, form])

  const handleSave = (data: CartItemEditSchema) => {
    if (!item?.product_id) return

    // Calculate the new total
    const calculations = calculateCartItemTotal(data)

    // Update the item in the POS store
    updateOrderItem(item.product_id, {
      quantity: data.quantity,
      unit_price: data.unit_price,
      discount: data.discount,
      description: data.description,
      total: calculations.total,
    })

    // Close dialog
    onOpenChange(false)
  }

  const handleCancel = () => {
    form.reset()
    onOpenChange(false)
  }

  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Editar Item
          </DialogTitle>
          <DialogDescription>
            Modifica los detalles del producto en el carrito
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleSave)}>
            <CartItemEditForm item={item} />

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button type="submit">Guardar cambios</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
