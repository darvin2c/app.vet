'use client'

import React from 'react'
import { usePOSStore } from '@/hooks/pos/use-pos-store'
import { POSHeader } from './pos-header'
import { POSProductSection } from './pos-product-section'
import { POSCart } from './pos-cart'
import { POSPayment } from './pos-payment'
import { POSCartMobile } from './pos-cart-mobile'

interface POSInterfaceProps {
  onOrderCreated?: () => void
  onClose?: () => void
}

export function POSInterface({ onOrderCreated, onClose }: POSInterfaceProps) {
  const { currentView } = usePOSStore()

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <POSHeader />

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_auto] overflow-hidden">
        {/* Product Section */}
        {currentView === 'catalog' && <POSProductSection />}
        {/* Payment Modal */}
        {currentView === 'payment' && (
          <POSPayment
            onBack={() => {
              const { setCurrentView } = usePOSStore.getState()
              setCurrentView('catalog')
            }}
          />
        )}

        <POSCart className="hidden lg:flex" />
        <POSCartMobile />
      </div>
    </div>
  )
}
