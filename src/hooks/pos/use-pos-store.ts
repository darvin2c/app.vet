'use client'

import { create } from 'zustand'
import { Database } from '@/types/supabase.types'

type Product = Database['public']['Tables']['products']['Row']
type Customer = Database['public']['Tables']['customers']['Row']

interface CartItem {
  product: Product
  quantity: number
  price: number
  subtotal: number
}

interface POSState {
  // Cart
  cartItems: CartItem[]
  cartTotal: number
  cartSubtotal: number
  cartTax: number

  // Customer
  selectedCustomer: Customer | null

  // UI State
  currentView: 'catalog' | 'payment' | 'receipt'
  isLoading: boolean
  isMobileCartOpen: boolean

  // Actions
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateCartItemQuantity: (productId: string, quantity: number) => void
  clearCart: () => void

  setSelectedCustomer: (customer: Customer | null) => void

  setCurrentView: (view: 'catalog' | 'payment' | 'receipt') => void
  setIsLoading: (loading: boolean) => void
  setIsMobileCartOpen: (open: boolean) => void

  calculateTotals: () => void

  // Order creation data
  getOrderData: () => {
    customer_id: string | null
    subtotal: number
    tax: number
    total: number
    paid_amount: number
    status: 'pending' | 'completed' | 'cancelled'
    notes?: string
  }
}

export const usePOSStore = create<POSState>((set, get) => ({
  // Initial state
  cartItems: [],
  cartTotal: 0,
  cartSubtotal: 0,
  cartTax: 0,
  selectedCustomer: null,
  currentView: 'catalog',
  isLoading: false,
  isMobileCartOpen: false,

  // Actions
  addToCart: (product, quantity = 1) => {
    const state = get()
    const existingItem = state.cartItems.find(
      (item) => item.product.id === product.id
    )

    if (existingItem) {
      // Update existing item
      set({
        cartItems: state.cartItems.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                subtotal: (item.quantity + quantity) * item.price,
              }
            : item
        ),
      })
    } else {
      // Add new item
      const newItem: CartItem = {
        product,
        quantity,
        price: product.price || 0,
        subtotal: (product.price || 0) * quantity,
      }
      set({ cartItems: [...state.cartItems, newItem] })
    }

    get().calculateTotals()
  },

  removeFromCart: (productId) => {
    const state = get()
    set({
      cartItems: state.cartItems.filter(
        (item) => item.product.id !== productId
      ),
    })
    get().calculateTotals()
  },

  updateCartItemQuantity: (productId, quantity) => {
    const state = get()
    if (quantity <= 0) {
      get().removeFromCart(productId)
      return
    }

    set({
      cartItems: state.cartItems.map((item) =>
        item.product.id === productId
          ? { ...item, quantity, subtotal: quantity * item.price }
          : item
      ),
    })
    get().calculateTotals()
  },

  clearCart: () => {
    set({
      cartItems: [],
      cartTotal: 0,
      cartSubtotal: 0,
      cartTax: 0,
    })
  },

  setSelectedCustomer: (customer) => {
    set({ selectedCustomer: customer })
  },

  setCurrentView: (view) => {
    set({ currentView: view })
  },

  setIsLoading: (loading) => {
    set({ isLoading: loading })
  },

  setIsMobileCartOpen: (open) => {
    set({ isMobileCartOpen: open })
  },

  calculateTotals: () => {
    const state = get()
    const subtotal = state.cartItems.reduce(
      (sum, item) => sum + item.subtotal,
      0
    )
    const tax = subtotal * 0.18 // 18% tax rate
    const total = subtotal + tax

    set({
      cartSubtotal: subtotal,
      cartTax: tax,
      cartTotal: total,
    })
  },

  getOrderData: () => {
    const state = get()
    return {
      customer_id: state.selectedCustomer?.id || null,
      subtotal: state.cartSubtotal,
      tax: state.cartTax,
      total: state.cartTotal,
      paid_amount: state.cartTotal, // Asumimos pago completo por defecto
      status: 'completed' as const,
      notes: `Venta POS - ${state.cartItems.length} productos`,
    }
  },
}))
