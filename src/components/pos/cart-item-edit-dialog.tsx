'use client'

import { useState, useEffect, useMemo } from 'react'
import { useForm, type FieldValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Package, Calculator } from 'lucide-react'
import { usePOSStore, type CartItem } from '@/hooks/pos/use-pos-store'
import { CurrencyDisplay } from '@/components/ui/currency-input'

// Schema de validación para editar item del carrito
const cartItemEditSchema = z.object({
  quantity: z
    .number()
    .min(1, 'La cantidad debe ser mayor a 0')
    .max(999, 'La cantidad no puede ser mayor a 999'),
  unit_price: z
    .number()
    .min(0, 'El precio unitario debe ser mayor o igual a 0')
    .max(99999, 'El precio no puede ser mayor a 99,999'),
  discount: z
    .number()
    .min(0, 'El descuento debe ser mayor o igual a 0')
    .max(100, 'El descuento no puede ser mayor a 100%')
    .default(0),
  description: z
    .string()
    .max(500, 'La descripción no puede tener más de 500 caracteres')
    .optional(),
})

type CartItemEditFormData = z.infer<typeof cartItemEditSchema>

interface CartItemEditDialogProps {
  item: CartItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartItemEditDialog({
  item,
  open,
  onOpenChange,
}: CartItemEditDialogProps) {
  const { updateCartItemQuantity, cartItems } = usePOSStore()

  const form = useForm({
    resolver: zodResolver(cartItemEditSchema),
    defaultValues: {
      quantity: 1,
      unit_price: 0,
      discount: 0,
      description: '',
    },
    mode: 'onChange',
  })

  // Actualizar valores del formulario cuando cambie el item
  useEffect(() => {
    if (item) {
      form.reset({
        quantity: item.quantity,
        unit_price: item.price,
        discount: 0, // Por ahora no manejamos descuentos en el store
        description: item.product.notes || '',
      })
    }
  }, [item, form])

  // Calcular totales en tiempo real usando useMemo para evitar bucles infinitos
  const quantity = form.watch('quantity')
  const unit_price = form.watch('unit_price')
  const discount = form.watch('discount')

  const calculations = useMemo(() => {
    if (quantity && unit_price >= 0) {
      const subtotal = quantity * unit_price
      const discountAmount = (subtotal * (discount || 0)) / 100
      const total = subtotal - discountAmount

      return {
        subtotal,
        discountAmount,
        total,
      }
    }
    
    return {
      subtotal: 0,
      discountAmount: 0,
      total: 0,
    }
  }, [quantity, unit_price, discount])

  const handleSave = (data: CartItemEditFormData) => {
    if (!item) return

    // Por ahora solo actualizamos cantidad y precio
    // En el futuro se puede extender para manejar descuentos y descripción personalizada
    const updatedItem = {
      ...item,
      quantity: data.quantity,
      price: data.unit_price,
      subtotal: data.quantity * data.unit_price,
    }

    // Actualizar en el store
    updateCartItemQuantity(item.product.id, data.quantity)
    
    // Si el precio cambió, necesitamos actualizar el store manualmente
    if (data.unit_price !== item.price) {
      const currentCartItems = usePOSStore.getState().cartItems
      const updatedCartItems = currentCartItems.map((cartItem) =>
        cartItem.product.id === item.product.id
          ? {
              ...cartItem,
              price: data.unit_price,
              subtotal: data.quantity * data.unit_price,
            }
          : cartItem
      )
      
      // Actualizar el store directamente
      usePOSStore.setState({ cartItems: updatedCartItems })
      usePOSStore.getState().calculateTotals()
    }

    onOpenChange(false)
    form.reset()
  }

  const handleCancel = () => {
    onOpenChange(false)
    form.reset()
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
            {/* Información del producto */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{item.product.name}</h4>
                <Badge variant="secondary">
                  SKU: {item.product.sku || 'N/A'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Precio original: S/ {item.product.price?.toFixed(2) || '0.00'}
              </p>
            </div>

            <Separator />

            {/* Campos editables */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="999"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio Unitario</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descuento (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción personalizada (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Agregar notas o descripción personalizada..."
                      className="resize-none"
                      rows={3}
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button type="submit">
                Guardar cambios
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}