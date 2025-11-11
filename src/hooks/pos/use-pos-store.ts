'use client'

import { Enums, Tables, TablesInsert } from '@/types/supabase.types'
import { create } from 'zustand'

type Customer = Tables<'customers'>
type Order = Omit<TablesInsert<'orders'>, 'tenant_id'>
type OrderItem = Omit<TablesInsert<'order_items'>, 'tenant_id' | 'order_id'> & {
  product?: Product
}
type Payment = Omit<TablesInsert<'payments'>, 'tenant_id' | 'order_id'> & {
  payment_method?: Tables<'payment_methods'>
}
type orderStatus = Enums<'order_status'>
type Product = Tables<'products'>

type OrderQueryType = Tables<'orders'> & {
  order_items: Tables<'order_items'>[]
  payments: Tables<'payments'>[]
  customer?: Tables<'customers'> | null
}

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
  openCartMobile: boolean

  // Search
  setSearchQuery: (query: string) => void

  // ui state
  setCurrentView: (view: POSState['currentView']) => void
  setOpenCartMobile: (open: boolean) => void

  //setCustomer
  setCustomer: (customer: Customer | null) => void
  setTenant: (tenant: Tables<'tenants'> | null) => void

  setOrder: (order: Order | null) => void
  // items
  addProductToOrder: (product: Product) => void
  removeOrderItem: (productId: string) => void
  updateOrderItem: (productId: string, updates: Partial<OrderItem>) => void
  // payments
  addPayment: (payment: Payment) => void
  removePayment: (index: number) => void

  // clearAll
  clearAll: () => void
  // payments
  clearPayments: () => void
  // Clear items
  clearOrderItems: () => void
  // utils
  getOrderData: () => {
    order: Order
    orderItems: OrderItem[]
    payments: Payment[]
  }
  setOrderData: (orderData: OrderQueryType) => void
  enableReceiptTab: () => boolean
  enablePaymentTab: () => boolean
  orderItemCount: () => number
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
    openCartMobile: false,

    // Search
    setSearchQuery: (query) => set({ searchQuery: query }),

    // ui state
    setCurrentView: (view) => set({ currentView: view }),
    setOpenCartMobile: (open) => set({ openCartMobile: open }),

    //setCustomer
    setCustomer: (customer) => set({ customer }),

    setOrder: (order) => set({ order }),

    // items
    addProductToOrder: (product) => {
      const existingItem = get().orderItems.find(
        (item) => item.product_id === product.id
      )

      if (existingItem) {
        // Update existing item quantity
        get().updateOrderItem(existingItem.product_id, {
          quantity: existingItem.quantity + 1,
          product,
        })
      } else {
        // Add new item with unique ID and all required fields
        const newItem: OrderItem = {
          product_id: product.id,
          description: product.name,
          price_base: product.price || 0,
          quantity: 1,
          discount: 0,
          product,
        }

        set({
          orderItems: [...get().orderItems, newItem],
        })
      }

      updateOrderTotals()
    },

    removeOrderItem: (productId) => {
      set({
        orderItems: get().orderItems.filter(
          (item) => item.product_id !== productId
        ),
      })
      updateOrderTotals()
    },

    updateOrderItem: (productId, updates) => {
      set({
        orderItems: get().orderItems.map((item) =>
          item.product_id === productId ? { ...item, ...updates } : item
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
        payments: get().payments.filter((_, index) => index !== paymentId),
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
        openCartMobile: false,
        tenant: null,
      }),

    // utils
    getOrderData: () => {
      const { order, orderItems, payments } = get()

      // Create deep copies to avoid mutating state
      const orderItemsCopy = orderItems.map((item) => ({ ...item }))
      const paymentsCopy = payments.map((payment) => ({ ...payment }))

      // Create order copy or default order if null
      const orderCopy: Order = order
        ? { ...order }
        : {
            total: 0,
            paid_amount: 0,
            balance: 0,
            status: 'confirmed' as orderStatus,
          }

      // Remove fields that should not be sent to server
      delete orderCopy.balance
      delete orderCopy.subtotal
      delete orderCopy.tax_amount

      // Remove calculated fields from order items
      orderItemsCopy.forEach((item) => {
        delete item.unit_price // price_base - discount
        delete item.total // unit_price * quantity
        delete item.product // product object
      })

      return {
        order: orderCopy,
        orderItems: orderItemsCopy,
        payments: paymentsCopy,
      } as {
        order: TablesInsert<'orders'>
        orderItems: TablesInsert<'order_items'>[]
        payments: TablesInsert<'payments'>[]
      }
    },
    setOrderData: (orderData: OrderQueryType) => {
      set({
        order: orderData,
        orderItems: orderData.order_items,
        payments: orderData.payments || [],
        customer: orderData.customer,
      })
    },
    // sum quantity
    orderItemCount: () =>
      get().orderItems.reduce((acc, item) => acc + item.quantity, 0),
    enableReceiptTab: () => !!get().order?.id,
    enablePaymentTab: () => get().orderItems.length > 0,
  }
})

export { usePOSStore }
