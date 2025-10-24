'use client'

import { PageBase } from '@/components/ui/page-base'
import { TenantGeneralSettings } from '@/components/settings/tenant-general-settings'
import { TenantBusinessSettings } from '@/components/settings/tenant-business-settings'
import { TenantOperationalSettings } from '@/components/settings/tenant-operational-settings'
import { TenantBrandingSettings } from '@/components/settings/tenant-branding-settings'
import { TenantDangerZone } from '@/components/settings/tenant-danger-zone'

export default function SettingsPage() {
  return (
    <PageBase
      title="Configuración"
      subtitle="Gestiona la configuración de tu organización"
    >
      <div className="space-y-6 max-w-3xl">
        <TenantGeneralSettings />
        <TenantBusinessSettings />
        <TenantOperationalSettings />
        <TenantBrandingSettings />
        <TenantDangerZone />
      </div>
    </PageBase>
  )
}
