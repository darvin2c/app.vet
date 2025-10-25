'use client'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemFooter,
  ItemGroup,
  ItemSeparator,
} from '@/components/ui/item'
import { Minus, Plus, Trash2, Package, ShoppingCart, Edit } from 'lucide-react'
import { usePOSStore } from '@/hooks/pos/use-pos-store'
import { Database } from '@/types/supabase.types'
import { CurrencyDisplay } from '@/components/ui/currency-input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { ButtonGroup } from '@/components/ui/button-group'
import { Separator } from '@/components/ui/separator'

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
            <>
              <CartItemCard
                key={item.product.id}
                item={item}
                onUpdateQuantity={updateCartItemQuantity}
                onRemove={removeFromCart}
              />
              {index < cartItems.length - 1 && <ItemSeparator />}
            </>
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
    </div>
  )
}

function CartItemCard({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItem
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
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
          <div>SKU: {item.product.sku}</div>
          <Separator orientation="vertical" />
          <div>
            <CurrencyDisplay>{item.price}</CurrencyDisplay>
          </div>
          <Separator orientation="vertical" />
          <div>Unid {item.quantity}</div>
        </ItemDescription>
      </ItemContent>

      <ItemActions>
        <ButtonGroup>
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
            className="h-8 w-8 p-0 text-blue-400 hover:text-blue-500"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </ButtonGroup>
      </ItemActions>
    </Item>
  )
}
