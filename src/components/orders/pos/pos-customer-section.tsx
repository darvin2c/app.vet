'use client'

import React from 'react'
import { POSCustomerSelector } from './pos-customer-selector'

export function POSCustomerSection() {
  return (
    <div className="p-3 sm:p-4 bg-white border-b">
      <POSCustomerSelector />
    </div>
  )
}
