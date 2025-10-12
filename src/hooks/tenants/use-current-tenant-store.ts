'use client'

import { Database } from '@/types/supabase.types'
import { create } from 'zustand'

type Tenant = Database['public']['Tables']['tenants']['Row']

type CurrentTenantStore = {
  currentTenant: Tenant | null
  setCurrentTenant: (tenant: Tenant | null) => void
}

const useCurrentTenantStore = create<CurrentTenantStore>((set) => ({
  currentTenant: null,
  setCurrentTenant: (tenant) => set({ currentTenant: tenant }),
}))

export default useCurrentTenantStore
