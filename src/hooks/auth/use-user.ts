'use client'

import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'

export default function useUser() {
  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession()
      return data.session?.user
    },
  })

  return userQuery
}

export function useProfile() {
  const { data: user } = useUser()
  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single()
      return data
    },
    enabled: !!user?.id,
  })

  return profileQuery
}
