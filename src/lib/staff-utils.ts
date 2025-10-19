import { Tables } from '@/types/supabase.types'

type Staff = Tables<'staff'>

/**
 * Genera el nombre completo de un miembro del staff
 * @param staff - El objeto staff con first_name y last_name
 * @returns El nombre completo formateado
 */
export function getStaffFullName(
  staff: Staff | { first_name: string; last_name: string | null }
): string {
  const firstName = staff.first_name || ''
  const lastName = staff.last_name || ''

  if (!firstName && !lastName) {
    return 'Sin nombre'
  }

  return `${firstName} ${lastName}`.trim()
}

/**
 * Genera las iniciales de un miembro del staff
 * @param staff - El objeto staff con first_name y last_name
 * @returns Las iniciales del nombre
 */
export function getStaffInitials(
  staff: Staff | { first_name: string; last_name: string | null }
): string {
  const firstName = staff.first_name || ''
  const lastName = staff.last_name || ''

  const firstInitial = firstName.charAt(0).toUpperCase()
  const lastInitial = lastName.charAt(0).toUpperCase()

  return `${firstInitial}${lastInitial}`.trim() || '??'
}
