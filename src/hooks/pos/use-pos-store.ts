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
  balance: number
  paymentStatus: PaymentStatus

  // UI State
  currentView: 'catalog' | 'payment' | 'receipt'
  isLoading: boolean
  isMobileCartOpen: boolean

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

  setCurrentView: (view: 'catalog' | 'payment' | 'receipt') => void
  setIsLoading: (loading: boolean) => void
  setIsMobileCartOpen: (open: boolean) => void

  calculateTotals: () => void

  // Order creation data
  getOrderData: () => {
    custumer_id: string
    subtotal: number
    tax: number
    total: number
    paid_amount: number
    balance: number
    status: Enums<'order_status'>
    notes?: string
  }

  // Payment validation and utilities
  isPaymentComplete: () => boolean
  canProcessOrder: () => boolean
  canAddPaymentAmount: (amount: number) => boolean
  getPaymentStatusInfo: () => {
    status: PaymentStatus
    balance: number
    statusOption: any
    percentage: number
  }

  // Funciones para diferentes tipos de guardado
  canSaveWithoutPayment: () => boolean
  canSaveWithPartialPayment: () => boolean
  canSaveWithFullPayment: () => boolean
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
  balance: 0,
  paymentStatus: 'pending',
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
      cartTotal: 0,
      cartSubtotal: 0,
      cartTax: 0,
      balance: 0,
      paymentStatus: 'pending',
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

  calculatePaymentTotals: () => {
    const state = get()
    const totalPaid = state.payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    )

    // Usar funciones del schema para cálculos consistentes
    const balance = calculateBalance(state.cartTotal, totalPaid)
    const paymentStatus = getPaymentStatus(totalPaid, state.cartTotal)
    const remainingAmount = Math.max(0, state.cartTotal - totalPaid)
    const changeAmount = Math.max(0, totalPaid - state.cartTotal)

    set({
      totalPaid,
      remainingAmount,
      changeAmount,
      balance,
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
    const orderStatus = getOrderStatusFromPayment(
      state.totalPaid,
      state.cartTotal
    )

    return {
      custumer_id: state.selectedCustomer?.id || '',
      subtotal: state.cartSubtotal,
      tax: state.cartTax,
      total: state.cartTotal,
      paid_amount: state.totalPaid,
      balance: state.balance,
      status: orderStatus,
      notes: `Venta POS - ${state.cartItems.length} productos`,
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
    return canAddPayment(state.totalPaid, state.cartTotal, amount)
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
