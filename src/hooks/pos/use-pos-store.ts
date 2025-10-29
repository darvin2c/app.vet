'use client'

import { Enums, Tables, TablesInsert } from '@/types/supabase.types'
import { create } from 'zustand'

type Customer = Tables<'customers'>
type Order = Omit<TablesInsert<'orders'>, 'tenant_id'>
type OrderItem = Omit<TablesInsert<'order_items'>, 'tenant_id'>
type Payment = Omit<TablesInsert<'payments'>, 'tenant_id'>
type orderStatus = Enums<'order_status'>

interface POSState {
  searchQuery: string

  tenant: Tables<'tenants'> | null
  order: Order | null
  orderItems: OrderItem[]
  payments: Payment[]

  // Customer
  customer: Customer | null

  // UI State
  currentView: 'catalog' | 'payment' | 'receipt'

  // Search
  setSearchQuery: (query: string) => void

  // ui state
  setCurrentView: (view: POSState['currentView']) => void

  //setCustomer
  setCustomer: (customer: Customer | null) => void
  setTenant: (tenant: Tables<'tenants'> | null) => void

  setOrder: (order: Order | null) => void
  // items
  addOrderItem: (item: OrderItem) => void
  removeOrderItem: (itemId: string) => void
  updateOrderItem: (itemId: string, updates: Partial<OrderItem>) => void
  // payments
  addPayment: (payment: Payment) => void
  removePayment: (paymentId: string) => void

  // clearAll
  clearAll: () => void
  // payments
  clearPayments: () => void
  // Clear items
  clearOrderItems: () => void
  // utils
  getOrderData: () => {
    order: Order | null
    orderItems: OrderItem[]
    payments: Payment[]
  }
  enableReceiptTab: () => boolean
  enablePaymentTab: () => boolean
}

const usePOSStore = create<POSState>()((set, get) => {
  // Helper function to update order totals
  const updateOrderTotals = () => {
    const state = get()

    // Calculate unit_price and total for each item (for display purposes)
    const updatedOrderItems = state.orderItems.map((item) => {
      // Round unit_price to 2 decimals
      const unit_price =
        Math.round((item.price_base - (item?.discount || 0)) * 100) / 100
      // Round item total to 2 decimals
      const total = Math.round(unit_price * item.quantity * 100) / 100
      return {
        ...item,
        unit_price,
        total,
      }
    })

    // Calculate total from order items and round to 2 decimals
    const total =
      Math.round(
        updatedOrderItems.reduce((acc, item) => acc + item.total, 0) * 100
      ) / 100

    // Calculate paid amount from payments and round to 2 decimals
    const paid_amount =
      Math.round(
        state.payments.reduce((acc, payment) => acc + payment.amount, 0) * 100
      ) / 100

    // Calculate balance and round to 2 decimals
    const balance = Math.round((total - paid_amount) * 100) / 100

    // Create or update order with calculated values
    const currentOrder = state.order || {
      total: 0,
      paid_amount: 0,
      balance: 0,
    }

    const paymentStatus: orderStatus =
      balance === 0
        ? 'paid'
        : balance > 0 && paid_amount > 0
          ? 'partial_payment'
          : 'confirmed'

    set({
      orderItems: updatedOrderItems,
      order: {
        ...currentOrder,
        status: paymentStatus,
        total,
        paid_amount,
        balance,
      },
    })
  }

  return {
    searchQuery: '',

    order: null,
    orderItems: [],
    payments: [],
    tenant: null,

    // Customer
    customer: null,

    // UI State
    currentView: 'catalog' as POSState['currentView'],

    // Search
    setSearchQuery: (query) => set({ searchQuery: query }),

    // ui state
    setCurrentView: (view) => set({ currentView: view }),

    //setCustomer
    setCustomer: (customer) => set({ customer }),

    setOrder: (order) => set({ order }),

    // items
    addOrderItem: (item) => {
      set({ orderItems: [...get().orderItems, item] })
      updateOrderTotals()
    },

    removeOrderItem: (itemId) => {
      set({
        orderItems: get().orderItems.filter((item) => item.id !== itemId),
      })
      updateOrderTotals()
    },

    updateOrderItem: (itemId, updates) => {
      set({
        orderItems: get().orderItems.map((item) =>
          item.id === itemId ? { ...item, ...updates } : item
        ),
      })
      updateOrderTotals()
    },

    // payments
    addPayment: (payment) => {
      set({ payments: [...get().payments, payment] })
      updateOrderTotals()
    },

    removePayment: (paymentId) => {
      set({
        payments: get().payments.filter((payment) => payment.id !== paymentId),
      })
      updateOrderTotals()
    },

    // Clear functions
    setTenant: (tenant) => set({ tenant }),
    clearPayments: () => {
      set({ payments: [] })
      updateOrderTotals()
    },
    clearOrderItems: () => {
      set({ orderItems: [] })
      updateOrderTotals()
    },

    // clearAll
    clearAll: () =>
      set({
        searchQuery: '',
        order: null,
        orderItems: [],
        payments: [],
        customer: null,
        currentView: 'catalog',
        tenant: null,
      }),

    // utils
    getOrderData: () => {
      const { order, orderItems, payments } = get()
      // this field, get from server, not from client
      delete order?.balance //
      delete order?.subtotal
      delete order?.tax_amount

      // this field, orderItems get from client, not from server
      orderItems.forEach((item) => {
        delete item.unit_price // price_base - discount
        delete item.total // unit_price * quantity
      })

      return { order, orderItems, payments }
    },
    enableReceiptTab: () => !!get().order?.id,
    enablePaymentTab: () => get().orderItems.length > 0,
  }
})

export { usePOSStore }
