'use client'

import { create } from 'zustand'
import { Database, Enums } from '@/types/supabase.types'
import {
  getPaymentStatus,
  calculateBalance,
  getOrderStatusFromPayment,
  canAddPayment,
  getPaymentStatusInfo,
} from '@/schemas/orders.schema'

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

// Tipos para estados de pago
type PaymentStatus = 'pending' | 'partial' | 'completed'

interface POSState {
  searchQuery: string
  // Cart
  cartItems: CartItem[]

  // Customer
  selectedCustomer: Customer | null

  // Payments
  payments: POSPayment[]
  totalPaid: number
  remainingAmount: number
  changeAmount: number
  paymentStatus: PaymentStatus

  // UI State
  currentView: 'catalog' | 'payment' | 'receipt'
  isLoading: boolean
  isMobileCartOpen: boolean
  error: string | null
  cartTotal: number
  cartSubtotal: number
  cartTax: number

  // Search
  setSearchQuery: (query: string) => void

  // Actions
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateCartItemQuantity: (productId: string, quantity: number) => void
  updateCartItemPrice: (productId: string, price: number) => void
  clearCart: () => void

  setSelectedCustomer: (customer: Customer | null) => void

  // Payment actions
  addPayment: (payment: Omit<POSPayment, 'id'>) => void
  removePayment: (paymentId: string) => void
  clearPayments: () => void
  calculatePaymentTotals: () => void
  calculateTotals: () => void

  setCurrentView: (view: 'catalog' | 'payment' | 'receipt') => void
  setIsLoading: (loading: boolean) => void
  setIsMobileCartOpen: (open: boolean) => void

  // Order creation data
  getOrderData: () => {
    customer_id: string | null
    status: 'confirmed' | 'cancelled' | 'partial_payment' | 'paid' | 'refunded'
    notes: string
  }

  // Payment validation and utilities
  isPaymentComplete: () => boolean
  canProcessOrder: () => boolean
  canAddPaymentAmount: (amount: number) => boolean
  getPaymentStatusInfo: () => {
    status: PaymentStatus
    label: string
    color: string
    icon: string
  }

  // Funciones para diferentes tipos de guardado
  canSaveWithoutPayment: () => boolean
  canSaveWithPartialPayment: () => boolean
  canSaveWithFullPayment: () => boolean
}

export const usePOSStore = create<POSState>((set, get) => ({
  // Search
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Initial state
  cartItems: [],
  selectedCustomer: null,
  payments: [],
  totalPaid: 0,
  remainingAmount: 0,
  changeAmount: 0,
  paymentStatus: 'pending',
  currentView: 'catalog',
  isLoading: false,
  isMobileCartOpen: false,
  error: null,
  cartTotal: 0,
  cartSubtotal: 0,
  cartTax: 0,

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
        subtotal: quantity * (product.price || 0),
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

  updateCartItemPrice: (productId, price) => {
    const state = get()
    set({
      cartItems: state.cartItems.map((item) =>
        item.product.id === productId
          ? { ...item, price, subtotal: item.quantity * price }
          : item
      ),
    })
    get().calculateTotals()
  },

  clearCart: () => {
    set({
      cartItems: [],
      paymentStatus: 'pending',
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

    // Validar que no se exceda el total
    if (!get().canAddPaymentAmount(payment.amount)) {
      throw new Error('El pago excede el monto pendiente')
    }

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
    get().calculatePaymentTotals()
  },

  calculateTotals: () => {
    const state = get()
    const subtotal = state.cartItems.reduce((sum, item) => sum + item.subtotal, 0)
    const tax = subtotal * 0.18 // 18% IGV
    const total = subtotal + tax

    set({
      cartSubtotal: subtotal,
      cartTax: tax,
      cartTotal: total,
    })

    get().calculatePaymentTotals()
  },

  calculatePaymentTotals: () => {
    const state = get()
    const totalPaid = state.payments.reduce((sum, payment) => sum + payment.amount, 0)
    const remainingAmount = Math.max(0, state.cartTotal - totalPaid)
    const changeAmount = Math.max(0, totalPaid - state.cartTotal)
    const paymentStatus = getPaymentStatus(totalPaid, state.cartTotal)

    set({
      totalPaid,
      remainingAmount,
      changeAmount,
      paymentStatus,
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



  getOrderData: () => {
    const state = get()
    const orderStatus = state.totalPaid >= state.cartTotal ? 'paid' : 
                       state.totalPaid > 0 ? 'partial_payment' : 'confirmed'

    return {
      customer_id: state.selectedCustomer?.id || null,
      status: orderStatus,
      notes: '',
    }
  },

  // Payment validation and utilities
  isPaymentComplete: () => {
    const state = get()
    return state.paymentStatus === 'completed'
  },

  canProcessOrder: () => {
    const state = get()
    return state.cartItems.length > 0 && state.selectedCustomer !== null
  },

  canAddPaymentAmount: (amount: number) => {
    const state = get()
    return state.totalPaid + amount <= state.cartTotal
  },

  getPaymentStatusInfo: () => {
    const state = get()
    return getPaymentStatusInfo(state.totalPaid, state.cartTotal)
  },

  // Funciones para diferentes tipos de guardado
  canSaveWithoutPayment: () => {
    const state = get()
    return state.cartItems.length > 0
  },

  canSaveWithPartialPayment: () => {
    const state = get()
    return (
      state.cartItems.length > 0 &&
      state.selectedCustomer !== null &&
      state.totalPaid > 0 &&
      state.totalPaid < state.cartTotal
    )
  },

  canSaveWithFullPayment: () => {
    const state = get()
    return (
      state.cartItems.length > 0 &&
      state.selectedCustomer !== null &&
      state.totalPaid >= state.cartTotal
    )
  },
}))

// Export types for use in components
export type { POSPayment, CartItem, PaymentStatus }
