'use client'

import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'
import useProfileStore from '@/hooks/auth/use-profile-store'
import useGetTenant from '@/hooks/tenants/use-get-tenant'
import { useProfile } from '@/hooks/auth/use-user'
import { Spinner } from '../ui/spinner'
import { useEffect } from 'react'
import cookies from 'js-cookie'

export default function TenantLoad({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: profileData, isFetched } = useProfile()
  const tenantSlug = cookies.get('tenant')
  const { data: tenantDetail } = useGetTenant(tenantSlug)
  const { setCurrentTenant } = useCurrentTenantStore()
  const { setProfile } = useProfileStore()

  useEffect(() => {
    console.log('tenantDetail', tenantDetail)
    setCurrentTenant(tenantDetail || null)
  }, [tenantDetail])
  useEffect(() => {
    console.log('profileData', profileData)
    setProfile(profileData || null)
  }, [profileData])

  if (!isFetched)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Spinner />
      </div>
    )

  return <>{children}</>
}
