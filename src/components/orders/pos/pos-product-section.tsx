'use client'

import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { POSProductGrid } from './pos-product-grid'

export function POSProductSection() {
  return (
    <ScrollArea className="overflow-auto">
      <div className="flex-1 flex flex-col">
        {/* Product Grid */}
        <div className="p-3 sm:p-4">
          <POSProductGrid />
        </div>
      </div>
    </ScrollArea>
  )
}
