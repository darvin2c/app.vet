'use client'

import { Tables } from '@/types/supabase.types'
import { create } from 'zustand'

type Tenant = Tables<'tenants'>

type CurrentTenantStore = {
  currentTenant: Tenant | null
  setCurrentTenant: (tenant: Tenant | null) => void
}

const useCurrentTenantStore = create<CurrentTenantStore>((set) => ({
  currentTenant: null,
  setCurrentTenant: (tenant) => set({ currentTenant: tenant }),
}))

export default useCurrentTenantStore
