import type { Database } from '@/types/supabase.types'

type TreatmentStatus = Database['public']['Enums']['treatment_status']
type TreatmentType = Database['public']['Enums']['treatment_type']

export function getStatusVariant(
  status: TreatmentStatus
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'draft':
      return 'outline'
    case 'completed':
      return 'default'
    case 'cancelled':
      return 'destructive'
    default:
      return 'secondary'
  }
}

export function getStatusLabel(status: TreatmentStatus): string {
  switch (status) {
    case 'draft':
      return 'Borrador'
    case 'completed':
      return 'Completado'
    case 'cancelled':
      return 'Cancelado'
    default:
      return status
  }
}

export function getTypeLabel(type: TreatmentType): string {
  switch (type) {
    case 'vaccination':
      return 'Vacunación'
    case 'surgery':
      return 'Cirugía'
    case 'grooming':
      return 'Peluquería'
    case 'deworming':
      return 'Desparasitación'
    case 'boarding':
      return 'Hospedaje'
    case 'training':
      return 'Entrenamiento'
    default:
      return type
  }
}
