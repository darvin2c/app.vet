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
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header with Navigation */}
      <POSHeader onClose={onClose} />

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_auto] overflow-hidden">
        {/* Product Section */}
        {currentView === 'catalog' && <POSProductSection />}
        {/* Payment Modal */}
        {currentView === 'payment' && (
          <POSPayment
            onOrderCreated={onOrderCreated}
            onClose={() => {
              const { setCurrentView } = usePOSStore.getState()
              setCurrentView('catalog')
            }}
          />
        )}

        {/* Cart Section */}
        <POSCartSection />
      </div>

      {/* Mobile Cart Drawer */}
      <POSMobileCartDrawer />
    </div>
  )
}
