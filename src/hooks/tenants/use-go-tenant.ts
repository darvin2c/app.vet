'use client'

import { Database } from '@/types/supabase.types'

type Tenant = Database['public']['Tables']['tenants']['Row']
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN

export function useGoTenant() {
  const router = useRouter()
  const [protocol, setProtocol] = useState('https:')
  const [port, setPort] = useState('')

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window !== 'undefined') {
      setProtocol(window.location.protocol)
      setPort(window.location.port ? `:${window.location.port}` : '')
    }
  }, [])

  function goTenant(tenant: Tenant) {
    const url = urlTenant(tenant)
    router.push(url)
  }

  const urlTenant = (tenant: Tenant) => {
    return `${protocol}//${tenant.slug}.${DOMAIN}${port}`
  }

  return {
    goTenant,
    urlTenant,
  }
}
