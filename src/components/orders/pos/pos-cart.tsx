'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemActions,
  ItemGroup,
  ItemSeparator,
} from '@/components/ui/item'
import {
  Trash2,
  Package,
  ShoppingCart,
  Edit,
  CreditCard,
  Trash,
} from 'lucide-react'
import { usePOSStore } from '@/hooks/pos/use-pos-store'
import { TablesInsert, Tables } from '@/types/supabase.types'
import { ButtonGroup } from '@/components/ui/button-group'
import { Separator } from '@/components/ui/separator'
import { CartItemEditDialog } from '@/components/orders/pos/cart-item-edit-dialog'
import { cn } from '@/lib/utils'
import { CurrencyDisplay } from '@/components/ui/current-input'
import { ProductIcon, RemoveIcon, ServiceIcon } from '@/components/icons'

type OrderItem = Omit<TablesInsert<'order_items'>, 'tenant_id' | 'order_id'> & {
  product?: Tables<'products'>
}

interface POSCartProps {
  className?: string
}

export function POSCart({ className }: POSCartProps) {
  const {
    orderItems,
    order,
    customer,
    removeOrderItem,
    setCurrentView,
    orderItemCount,
    clearOrderItems,
  } = usePOSStore()

  const [editingItem, setEditingItem] = useState<OrderItem | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleEditItem = (item: OrderItem) => {
    setEditingItem(item)
    setIsEditDialogOpen(true)
  }

  const handleProceedToPayment = () => {
    setCurrentView('payment')
  }

  const handleClearCart = () => {
    clearOrderItems()
  }

  const handleRemoveItem = (productId: string) => {
    removeOrderItem(productId)
  }

  return (
    <div
      className={cn(
        'flex flex-col h-full w-full lg:w-96 border-l bg-muted/30',
        className
      )}
    >
      {/* Cart Header */}
      <div className="p-4 border-b bg-background">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <h2 className="font-semibold">Carrito</h2>
            {orderItemCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {orderItemCount()}
              </Badge>
            )}
          </div>
          {orderItemCount() > 0 && (
            <Button size="sm" variant="ghost" onClick={handleClearCart}>
              <Trash className="h-4 w-4" />
              Limpiar carrito
            </Button>
          )}
        </div>
      </div>

      {/* Cart Content */}
      {orderItemCount() === 0 ? (
        <div className="flex flex-col items-center justify-center h-full p-6">
          <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            Carrito vacío
          </h3>
          <p className="text-sm text-gray-500">
            Agrega productos desde el catálogo para comenzar
          </p>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <ScrollArea className="flex-1">
            <ItemGroup>
              {orderItems.map((item, index) => (
                <React.Fragment key={index}>
                  <CartItemCard
                    item={item}
                    onRemove={handleRemoveItem}
                    onEdit={handleEditItem}
                  />
                  {index < orderItems.length - 1 && <ItemSeparator />}
                </React.Fragment>
              ))}
            </ItemGroup>
          </ScrollArea>

          {/* Cart Summary */}
          <div className="p-4 border-t bg-gray-50">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <CurrencyDisplay value={order?.subtotal || 0} />
              </div>

              <div className="flex justify-between text-sm">
                <span>IGV (18%):</span>
                <CurrencyDisplay value={order?.tax || 0} />
              </div>

              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <CurrencyDisplay value={order?.total || 0} />
              </div>
            </div>
          </div>

          {/* Cart Footer */}
          <div className="p-4">
            <Button
              onClick={handleProceedToPayment}
              className="w-full h-12 text-base font-semibold"
              size="lg"
              disabled={orderItemCount() === 0}
            >
              <CreditCard className="h-5 w-5 mr-2" />
              Procesar Pago
            </Button>
          </div>
        </>
      )}

      {/* Dialog para editar item */}
      <CartItemEditDialog
        item={editingItem}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </div>
  )
}

function CartItemCard({
  item,
  onRemove,
  onEdit,
}: {
  item: OrderItem
  onRemove: (productId: string) => void
  onEdit: (item: OrderItem) => void
}) {
  // Calcular subtotal del item
  const subtotal =
    (item.unit_price || 0) * (item.quantity || 0) - (item.discount || 0)

  return (
    <Item size="sm" className="py-1 px-2">
      <ItemMedia>
        {item.product?.is_service ? (
          <ServiceIcon className="h-5 w-5 text-gray-400" />
        ) : (
          <ProductIcon className="h-5 w-5 text-gray-400" />
        )}
      </ItemMedia>

      <ItemContent>
        <ItemTitle className="text-sm flex justify-between w-full">
          <div>
            {item.description || item.product?.name || 'Producto sin nombre'}
          </div>
          <div>
            <CurrencyDisplay value={subtotal} />
          </div>
        </ItemTitle>
        <div className="text-xs text-muted-foreground flex h-5 items-center space-x-2">
          <span>ID: {item.product?.sku || 'N/A'}</span>
          <Separator orientation="vertical" />
          <span>
            <CurrencyDisplay value={item.unit_price || 0} />
          </span>
          <Separator orientation="vertical" />
          <span>Unid {item.quantity || 0}</span>
          {item.discount && item.discount > 0 && (
            <>
              <Separator orientation="vertical" />
              <span>
                Desc: <CurrencyDisplay value={item.discount} />
              </span>
            </>
          )}
        </div>
      </ItemContent>

      <ItemActions>
        <ButtonGroup orientation="vertical">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(item.product_id || '')}
            className="h-8 w-8 p-0 text-red-400 hover:text-red-500"
          >
            <RemoveIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(item)}
            className="h-8 w-8 p-0 text-blue-400 hover:text-blue-500"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </ButtonGroup>
      </ItemActions>
    </Item>
  )
}
