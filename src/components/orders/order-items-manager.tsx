'use client'

import { useState, useCallback, useMemo } from 'react'
import { Plus, Edit, Trash2, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ProductSelect } from '@/components/products/product-select'
import { Input } from '@/components/ui/input'
import { Tables } from '@/types/supabase.types'
import { calculateOrderItemTotal } from '@/schemas/order-items.schema'
import { useTenantDetail } from '@/hooks/tenants/use-tenant-detail'
import { CurrencyDisplay } from '../ui/current-input'

type OrderItem = Tables<'order_items'> & {
  products: Tables<'products'> | null
  subtotal?: number
  tax?: number
}

interface OrderItemsManagerProps {
  orderId?: string
  items: OrderItem[]
  onItemsChange: (items: OrderItem[]) => void
  currency?: string
  disabled?: boolean
}

interface NewOrderItem {
  product_id: string
  description: string
  quantity: number
  unit_price: number
  discount: number
}

export function OrderItemsManager({
  orderId,
  items,
  onItemsChange,
  currency = 'PEN',
  disabled = false,
}: OrderItemsManagerProps) {
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [newItem, setNewItem] = useState<NewOrderItem>({
    product_id: '',
    description: '',
    quantity: 1,
    unit_price: 0,
    discount: 0,
  })

  // Obtener el tax rate del tenant
  const { data: tenant } = useTenantDetail()
  const tenantTaxRate = tenant?.tax || 0

  // Calcular totales
  const totals = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        const itemTotal = calculateOrderItemTotal({
          quantity: item.quantity,
          unit_price: item.unit_price || 0,
          discount: item.discount,
          tax_rate: tenantTaxRate,
        })

        return {
          subtotal: acc.subtotal + itemTotal.subtotal,
          tax: acc.tax + itemTotal.tax,
          total: acc.total + itemTotal.total,
        }
      },
      { subtotal: 0, tax: 0, total: 0 }
    )
  }, [items, tenantTaxRate])

  const handleAddItem = useCallback(() => {
    if (!newItem.product_id || newItem.quantity <= 0) return

    const itemTotal = calculateOrderItemTotal({
      quantity: newItem.quantity,
      unit_price: newItem.unit_price,
      discount: newItem.discount,
      tax_rate: tenantTaxRate,
    })

    const orderItem: OrderItem = {
      id: `temp-${Date.now()}`,
      order_id: orderId || '',
      product_id: newItem.product_id || '',
      description: newItem.description,
      quantity: newItem.quantity,
      unit_price: newItem.unit_price,
      discount: newItem.discount,
      total: itemTotal.total,
      price_base: newItem.unit_price,
      tenant_id: null,
      products: null,
    }

    onItemsChange([...items, orderItem])
    setNewItem({
      product_id: '',
      description: '',
      quantity: 1,
      unit_price: 0,
      discount: 0,
    })
    setIsAddingItem(false)
  }, [newItem, items, onItemsChange, orderId, tenantTaxRate])

  const handleUpdateItem = useCallback(
    (itemId: string, updatedItem: Partial<OrderItem>) => {
      const updatedItems = items.map((item) => {
        if (item.id === itemId) {
          const updated = { ...item, ...updatedItem }

          // Recalcular totales si se actualizan campos relevantes
          if (
            updatedItem.quantity !== undefined ||
            updatedItem.unit_price !== undefined ||
            updatedItem.discount !== undefined
          ) {
            const itemTotal = calculateOrderItemTotal({
              quantity: updated.quantity,
              unit_price: updated.unit_price || 0,
              discount: updated.discount,
              tax_rate: tenantTaxRate,
            })

            updated.total = itemTotal.total
            updated.subtotal = itemTotal.subtotal
            updated.tax = itemTotal.tax
          }

          return updated
        }
        return item
      })
      onItemsChange(updatedItems)
      setEditingItemId(null)
    },
    [items, onItemsChange, tenantTaxRate]
  )

  const handleRemoveItem = useCallback(
    (itemId: string) => {
      const updatedItems = items.filter((item) => item.id !== itemId)
      onItemsChange(updatedItems)
    },
    [items, onItemsChange]
  )

  const handleProductSelect = useCallback((productId: string) => {
    // Find the product by ID
    // For now, just set the product_id
    setNewItem((prev) => ({
      ...prev,
      product_id: productId,
    }))
  }, [])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Items de la Orden
          </CardTitle>
          {!disabled && (
            <Button
              onClick={() => setIsAddingItem(true)}
              size="sm"
              disabled={isAddingItem}
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Item
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Tabla de items */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead className="text-right">Precio Unit.</TableHead>
                <TableHead className="text-right">Descuento</TableHead>
                <TableHead className="text-right">
                  Tax ({(tenantTaxRate * 100).toFixed(0)}%)
                </TableHead>
                <TableHead className="text-right">Total</TableHead>
                {!disabled && (
                  <TableHead className="w-[100px]">Acciones</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Formulario para agregar nuevo item */}
              {isAddingItem && (
                <TableRow>
                  <TableCell>
                    <ProductSelect
                      onValueChange={handleProductSelect}
                      placeholder="Seleccionar producto..."
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="1"
                      value={newItem.quantity}
                      onChange={(e) =>
                        setNewItem((prev) => ({
                          ...prev,
                          quantity: parseInt(e.target.value) || 1,
                        }))
                      }
                      className="text-right"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newItem.unit_price}
                      onChange={(e) =>
                        setNewItem((prev) => ({
                          ...prev,
                          unit_price: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="text-right"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={newItem.discount}
                      onChange={(e) =>
                        setNewItem((prev) => ({
                          ...prev,
                          discount: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="text-right"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    {(tenantTaxRate * 100).toFixed(0)}%
                  </TableCell>
                  <TableCell className="text-right">
                    <CurrencyDisplay
                      value={
                        calculateOrderItemTotal({
                          quantity: newItem.quantity,
                          unit_price: newItem.unit_price,
                          discount: newItem.discount,
                          tax_rate: tenantTaxRate,
                        }).total
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        onClick={handleAddItem}
                        disabled={!newItem.product_id}
                      >
                        Agregar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setIsAddingItem(false)
                          setNewItem({
                            product_id: '',
                            description: '',
                            quantity: 1,
                            unit_price: 0,
                            discount: 0,
                          })
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {/* Items existentes */}
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.description}</div>
                      {item.products && (
                        <div className="text-sm text-muted-foreground">
                          {item.products.name}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    <CurrencyDisplay value={item.unit_price || 0} />
                  </TableCell>
                  <TableCell className="text-right">{item.discount}%</TableCell>
                  <TableCell className="text-right">
                    {(tenantTaxRate * 100).toFixed(0)}%
                  </TableCell>
                  <TableCell className="text-right">
                    <CurrencyDisplay value={item.total || 0} />
                  </TableCell>
                  {!disabled && (
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingItemId(item.id)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}

              {items.length === 0 && !isAddingItem && (
                <TableRow>
                  <TableCell
                    colSpan={disabled ? 6 : 7}
                    className="text-center py-8"
                  >
                    <div className="text-muted-foreground">
                      No hay items en esta orden
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Resumen de totales */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>
              <CurrencyDisplay value={totals.subtotal} />
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Impuestos ({(tenantTaxRate * 100).toFixed(0)}%):</span>
            <span>
              <CurrencyDisplay value={totals.tax} />
            </span>
          </div>
          <div className="flex justify-between font-medium text-lg border-t pt-2">
            <span>Total:</span>
            <span>
              <CurrencyDisplay value={totals.total} />
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
