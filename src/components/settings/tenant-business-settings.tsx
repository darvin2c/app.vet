'use client'

import React from 'react'
import { TenantCurrencyTimezoneSettings } from './tenant-currency-timezone-settings'
import { TenantBusinessHoursSettings } from './tenant-business-hours-settings'

// Main component that exports both cards
export function TenantBusinessSettings() {
  return (
    <div className="space-y-6">
      <TenantCurrencyTimezoneSettings />
      <TenantBusinessHoursSettings />
    </div>
  )
}
