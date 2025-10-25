'use client'

import { create } from 'zustand'
import { Database } from '@/types/supabase.types'

type Product = Database['public']['Tables']['products']['Row']
type Customer = Database['public']['Tables']['customers']['Row']
type PaymentMethod = Database['public']['Tables']['payment_methods']['Row']

interface CartItem {
  product: Product
  quantity: number
  price: number
  subtotal: number
}

interface POSPayment {
  id: string
  payment_method_id: string
  amount: number
  notes?: string
  payment_method?: PaymentMethod
  payment_date: string
}

interface POSState {
  // Cart
  cartItems: CartItem[]
  cartTotal: number
  cartSubtotal: number
  cartTax: number

  // Customer
  selectedCustomer: Customer | null

  // Payments
  payments: POSPayment[]
  totalPaid: number
  remainingAmount: number
  changeAmount: number

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

  // Payment actions
  addPayment: (payment: Omit<POSPayment, 'id'>) => void
  removePayment: (paymentId: string) => void
  clearPayments: () => void
  calculatePaymentTotals: () => void

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

  // Payment validation
  isPaymentComplete: () => boolean
  canProcessOrder: () => boolean
}

export const usePOSStore = create<POSState>((set, get) => ({
  // Initial state
  cartItems: [],
  cartTotal: 0,
  cartSubtotal: 0,
  cartTax: 0,
  selectedCustomer: null,
  payments: [],
  totalPaid: 0,
  remainingAmount: 0,
  changeAmount: 0,
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
    // También limpiar pagos cuando se limpia el carrito
    get().clearPayments()
  },

  setSelectedCustomer: (customer) => {
    set({ selectedCustomer: customer })
  },

  // Payment actions
  addPayment: (payment) => {
    const state = get()
    const newPayment: POSPayment = {
      ...payment,
      id: `temp-${Date.now()}-${Math.random()}`, // ID temporal único
    }

    set({ payments: [...state.payments, newPayment] })
    get().calculatePaymentTotals()
  },

  removePayment: (paymentId) => {
    const state = get()
    set({
      payments: state.payments.filter((payment) => payment.id !== paymentId),
    })
    get().calculatePaymentTotals()
  },

  clearPayments: () => {
    set({
      payments: [],
      totalPaid: 0,
      remainingAmount: 0,
      changeAmount: 0,
    })
  },

  calculatePaymentTotals: () => {
    const state = get()
    const totalPaid = state.payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    )
    const remainingAmount = Math.max(0, state.cartTotal - totalPaid)
    const changeAmount = Math.max(0, totalPaid - state.cartTotal)

    set({
      totalPaid,
      remainingAmount,
      changeAmount,
    })
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

    // Recalcular totales de pago cuando cambia el total del carrito
    get().calculatePaymentTotals()
  },

  getOrderData: () => {
    const state = get()
    return {
      customer_id: state.selectedCustomer?.id || null,
      subtotal: state.cartSubtotal,
      tax: state.cartTax,
      total: state.cartTotal,
      paid_amount: state.totalPaid,
      status: state.isPaymentComplete()
        ? ('completed' as const)
        : ('pending' as const),
      notes: `Venta POS - ${state.cartItems.length} productos`,
    }
  },

  // Payment validation
  isPaymentComplete: () => {
    const state = get()
    return state.totalPaid >= state.cartTotal && state.cartTotal > 0
  },

  canProcessOrder: () => {
    const state = get()
    return (
      state.cartItems.length > 0 &&
      state.selectedCustomer !== null &&
      state.isPaymentComplete()
    )
  },
}))

// Export types for use in components
export type { POSPayment, CartItem }
