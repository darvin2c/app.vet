'use client'

import { TenantBusinessSettings } from '@/components/settings/tenant-business-settings'
import { TenantBrandingSettings } from '@/components/settings/tenant-branding-settings'
import { TenantDangerZone } from '@/components/settings/tenant-danger-zone'
import PageBase from '@/components/page-base'
import TenantGeneralInfoCard from '@/components/settings/tenant-general-info-card'
import TenantLegalLocationCard from '@/components/settings/tenant-legal-location-card'
import CanAccess from '@/components/ui/can-access'

export default function SettingsPage() {
  return (
    <CanAccess>
      <PageBase
        title="Configuración"
        subtitle="Gestiona la configuración de tu organización"
      >
        <div className="space-y-6 max-w-5xl w-full mx-auto">
          <TenantGeneralInfoCard />
          <TenantLegalLocationCard />
          <TenantBusinessSettings />
          <TenantBrandingSettings />
          <TenantDangerZone />
        </div>
      </PageBase>
    </CanAccess>
  )
}
