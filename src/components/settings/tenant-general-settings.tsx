'use client'

import TenantGeneralInfoCard from './tenant-general-info-card'
import TenantLegalLocationCard from './tenant-legal-location-card'

export function TenantGeneralSettings() {
  return (
    <div className="space-y-6">
      <TenantGeneralInfoCard />
      <TenantLegalLocationCard />
    </div>
  )
}
