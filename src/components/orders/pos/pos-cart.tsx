'use client'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Minus, Plus, Trash2, Package, ShoppingCart } from 'lucide-react'
import { usePOSStore } from '@/hooks/pos/use-pos-store'
import { Database } from '@/types/supabase.types'

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
    cartTotal,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
  } = usePOSStore()

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
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
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-3 py-4">
          {cartItems.map((item) => (
            <CartItemCard
              key={item.product.id}
              item={item}
              onUpdateQuantity={updateCartItemQuantity}
              onRemove={removeFromCart}
            />
          ))}
        </div>
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

          <Separator />

          <div className="flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span>S/ {cartTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Clear Cart Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={clearCart}
          className="w-full mt-3 min-h-[40px]"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Limpiar Carrito
        </Button>
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
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      onUpdateQuantity(item.product.id, newQuantity)
    }
  }

  return (
    <div>
      <div className="flex gap-3">
        {/* Product Image Placeholder */}
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Package className="h-5 w-5 text-gray-400" />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm line-clamp-2">
                {item.product.name}
              </h4>
              {item.product.sku && (
                <p className="text-xs text-gray-500">SKU: {item.product.sku}</p>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(item.product.id)}
              className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Price and Quantity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                S/ {item.price.toFixed(2)} c/u
              </span>

              {/* Quantity Controls */}
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  className="h-8 w-8 p-0"
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>

                <span className="w-8 text-center text-sm font-medium">
                  {item.quantity}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  className="h-8 w-8 p-0"
                  disabled={false}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-end">
              <div className="text-right">
                <div className="text-sm font-semibold">
                  S/ {item.subtotal.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
