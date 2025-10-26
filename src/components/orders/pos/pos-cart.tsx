'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
  ItemSeparator,
} from '@/components/ui/item'
import { Trash2, Package, ShoppingCart, Edit } from 'lucide-react'
import { usePOSStore } from '@/hooks/pos/use-pos-store'
import { Database } from '@/types/supabase.types'
import { CurrencyDisplay } from '@/components/ui/currency-input'
import { ButtonGroup } from '@/components/ui/button-group'
import { Separator } from '@/components/ui/separator'
import { CartItemEditDialog } from '@/components/pos/cart-item-edit-dialog'

type Product = Database['public']['Tables']['products']['Row']

interface CartItem {
  product: Product
  quantity: number
  price: number
  subtotal: number
}

export function POSCart() {
  const {
    cartItems,
    cartSubtotal,
    cartTax,
    updateCartItemQuantity,
    removeFromCart,
  } = usePOSStore()

  const [editingItem, setEditingItem] = useState<CartItem | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleEditItem = (item: CartItem) => {
    setEditingItem(item)
    setIsEditDialogOpen(true)
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">
          Carrito vacío
        </h3>
        <p className="text-sm text-gray-500">
          Agrega productos desde el catálogo para comenzar
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Cart Items */}
      <ScrollArea className="flex-1">
        <ItemGroup>
          {cartItems.map((item, index) => (
            <React.Fragment key={item.product.id}>
              <CartItemCard
                item={item}
                onUpdateQuantity={updateCartItemQuantity}
                onRemove={removeFromCart}
                onEdit={handleEditItem}
              />
              {index < cartItems.length - 1 && <ItemSeparator />}
            </React.Fragment>
          ))}
        </ItemGroup>
      </ScrollArea>

      {/* Cart Summary */}
      <div className="p-4 border-t bg-gray-50">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>S/ {cartSubtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>IGV (18%):</span>
            <span>S/ {cartTax.toFixed(2)}</span>
          </div>
        </div>
      </div>

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
  onUpdateQuantity,
  onRemove,
  onEdit,
}: {
  item: CartItem
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
  onEdit: (item: CartItem) => void
}) {
  return (
    <Item size="sm">
      <ItemMedia>
        <Package className="h-5 w-5 text-gray-400" />
      </ItemMedia>

      <ItemContent>
        <ItemTitle className="text-sm flex justify-between w-full">
          <div>{item.product.name}</div>
          <div>
            <CurrencyDisplay>{item.subtotal}</CurrencyDisplay>
          </div>
        </ItemTitle>
        <ItemDescription className="text-xs text-muted-foreground flex h-5 items-center space-x-2">
          <span>SKU: {item.product.sku}</span>
          <Separator orientation="vertical" />
          <span>
            <CurrencyDisplay>{item.price}</CurrencyDisplay>
          </span>
          <Separator orientation="vertical" />
          <span>Unid {item.quantity}</span>
        </ItemDescription>
      </ItemContent>

      <ItemActions>
        <ButtonGroup orientation="vertical">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(item.product.id)}
            className="h-8 w-8 p-0 text-red-400 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
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
