'use client'

import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { POSProductGrid } from './pos-product-grid'

export function POSProductSection() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Product Grid */}
      <ScrollArea className="flex-1">
        <div className="p-3 sm:p-4">
          <POSProductGrid />
        </div>
      </ScrollArea>
    </div>
  )
}
