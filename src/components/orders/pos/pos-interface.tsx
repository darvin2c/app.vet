'use client'

import React from 'react'
import { usePOSStore } from '@/hooks/pos/use-pos-store'
import { POSHeader } from './pos-header'
import { POSProductSection } from './pos-product-section'
import { POSCart } from './pos-cart'
import { POSPayment } from './pos-payment'
import { POSCartMobile } from './pos-cart-mobile'
import { OrderPrint } from '../order-print'

interface POSInterfaceProps {
  onOrderCreated?: () => void
  onClose?: () => void
}

export function POSInterface({ onOrderCreated, onClose }: POSInterfaceProps) {
  const { currentView, order } = usePOSStore()

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <POSHeader onClose={onClose} />

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_auto] overflow-hidden">
        {/* Product Section */}
        {currentView === 'catalog' && <POSProductSection />}

        {/* Receipt Section */}
        {currentView === 'receipt' && order?.id && (
          <OrderPrint orderId={order.id} />
        )}

        {/* Cart - only show when not in receipt view */}
        {currentView !== 'receipt' && (
          <>
            <POSCart className="hidden lg:flex" />
            <POSCartMobile />
          </>
        )}
      </div>

      {/* Payment Modal */}
      {currentView === 'payment' && (
        <POSPayment
          onBack={() => {
            const { setCurrentView } = usePOSStore.getState()
            setCurrentView('catalog')
          }}
        />
      )}
    </div>
  )
}
