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
import { formatCurrency } from '@/lib/utils'

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
  tax_rate: number
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
    tax_rate: 0,
  })

  // Calcular totales
  const totals = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        const itemTotal = calculateOrderItemTotal({
          quantity: item.quantity,
          unit_price: item.unit_price,
          discount: item.discount,
          tax_rate: item.tax_rate,
        })

        return {
          subtotal: acc.subtotal + itemTotal.subtotal,
          tax: acc.tax + itemTotal.tax,
          total: acc.total + itemTotal.total,
        }
      },
      { subtotal: 0, tax: 0, total: 0 }
    )
  }, [items])

  const handleAddItem = useCallback(() => {
    if (!newItem.product_id || newItem.quantity <= 0) return

    const itemTotal = calculateOrderItemTotal({
      quantity: newItem.quantity,
      unit_price: newItem.unit_price,
      discount: newItem.discount,
      tax_rate: newItem.tax_rate,
    })

    const orderItem: OrderItem = {
      id: `temp-${Date.now()}`,
      order_id: orderId || '',
      product_id: newItem.product_id,
      description: newItem.description,
      quantity: newItem.quantity,
      unit_price: newItem.unit_price,
      discount: newItem.discount,
      tax_rate: newItem.tax_rate,
      subtotal: itemTotal.subtotal,
      tax: itemTotal.tax,
      total: itemTotal.total,
      created_at: new Date().toISOString(),
      tenant_id: '', // Se llenará cuando se guarde
      products: null, // Se llenará cuando se seleccione el producto
    }

    onItemsChange([...items, orderItem])
    setNewItem({
      product_id: '',
      description: '',
      quantity: 1,
      unit_price: 0,
      discount: 0,
      tax_rate: 0,
    })
    setIsAddingItem(false)
  }, [newItem, items, onItemsChange, orderId])

  const handleRemoveItem = useCallback(
    (itemId: string) => {
      onItemsChange(items.filter((item) => item.id !== itemId))
    },
    [items, onItemsChange]
  )

  const handleUpdateItem = useCallback(
    (itemId: string, updates: Partial<OrderItem>) => {
      const updatedItems = items.map((item) => {
        if (item.id === itemId) {
          const updatedItem = { ...item, ...updates }

          // Recalcular totales si cambian los valores relevantes
          if (
            'quantity' in updates ||
            'unit_price' in updates ||
            'discount' in updates ||
            'tax_rate' in updates
          ) {
            const itemTotal = calculateOrderItemTotal({
              quantity: updatedItem.quantity,
              unit_price: updatedItem.unit_price,
              discount: updatedItem.discount,
              tax_rate: updatedItem.tax_rate,
            })

            updatedItem.subtotal = itemTotal.subtotal
            updatedItem.tax = itemTotal.tax
            updatedItem.total = itemTotal.total
          }

          return updatedItem
        }
        return item
      })

      onItemsChange(updatedItems)
    },
    [items, onItemsChange]
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Productos de la Orden
          </CardTitle>
          {!disabled && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddingItem(true)}
              disabled={isAddingItem}
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Producto
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Tabla de productos */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead className="text-right">Precio Unit.</TableHead>
                <TableHead className="text-right">Descuento</TableHead>
                <TableHead className="text-right">Impuesto</TableHead>
                <TableHead className="text-right">Total</TableHead>
                {!disabled && (
                  <TableHead className="w-[100px]">Acciones</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.products?.name || 'Producto no encontrado'}
                  </TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.unit_price, currency)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.discount, currency)}
                  </TableCell>
                  <TableCell className="text-right">{item.tax_rate}%</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary">
                      {formatCurrency(item.total || 0, currency)}
                    </Badge>
                  </TableCell>
                  {!disabled && (
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingItemId(item.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}

              {/* Fila para agregar nuevo producto */}
              {isAddingItem && (
                <TableRow>
                  <TableCell>
                    <ProductSelect
                      value={newItem.product_id}
                      onValueChange={(value) =>
                        setNewItem((prev) => ({ ...prev, product_id: value }))
                      }
                      placeholder="Seleccionar producto"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={newItem.description}
                      onChange={(e) =>
                        setNewItem((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Descripción"
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
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={newItem.tax_rate}
                      onChange={(e) =>
                        setNewItem((prev) => ({
                          ...prev,
                          tax_rate: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="text-right"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleAddItem}
                        disabled={!newItem.product_id || newItem.quantity <= 0}
                      >
                        ✓
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsAddingItem(false)
                          setNewItem({
                            product_id: '',
                            description: '',
                            quantity: 1,
                            unit_price: 0,
                            discount: 0,
                            tax_rate: 0,
                          })
                        }}
                      >
                        ✕
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Resumen de totales */}
          <div className="flex justify-end">
            <div className="w-80 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(totals.subtotal, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Impuestos:</span>
                <span>{formatCurrency(totals.tax, currency)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total:</span>
                <span>{formatCurrency(totals.total, currency)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
