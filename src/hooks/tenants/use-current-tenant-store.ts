'use client'

import { Tables } from '@/types/supabase.types'
import { create } from 'zustand'

type Tenant = Tables<'tenants'> & {
  business_hours?: {
    enabled: boolean
    sunday?: { enabled: boolean; start: string; end: string }
    monday?: { enabled: boolean; start: string; end: string }
    tuesday?: { enabled: boolean; start: string; end: string }
    wednesday?: { enabled: boolean; start: string; end: string }
    thursday?: { enabled: boolean; start: string; end: string }
    friday?: { enabled: boolean; start: string; end: string }
    saturday?: { enabled: boolean; start: string; end: string }
  }
}

type CurrentTenantStore = {
  currentTenant: Tenant | null
  setCurrentTenant: (tenant: Tenant | null) => void
}

const useCurrentTenantStore = create<CurrentTenantStore>((set) => ({
  currentTenant: null,
  setCurrentTenant: (tenant) => set({ currentTenant: tenant }),
}))

export default useCurrentTenantStore
