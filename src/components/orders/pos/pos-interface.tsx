'use client'

import React from 'react'
import { usePOSStore } from '@/hooks/pos/use-pos-store'
import { POSHeader } from './pos-header'
import { POSProductSection } from './pos-product-section'
import { POSCartSection } from './pos-cart-section'
import { POSMobileCartDrawer } from './pos-mobile-cart-drawer'
import { POSPayment } from './pos-payment'

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

        <POSCartSection className="hidden lg:flex" />
        <POSMobileCartDrawer />
      </div>
    </div>
  )
}
