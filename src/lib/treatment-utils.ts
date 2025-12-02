// TODO: Estos enums no existen en la base de datos actual
// type TreatmentStatus = Database['public']['Enums']['treatment_status']
// type TreatmentType = Database['public']['Enums']['treatment_type']

type TreatmentStatus = 'draft' | 'completed' | 'cancelled'
type TreatmentType =
  | 'consultation'
  | 'vaccination'
  | 'surgery'
  | 'grooming'
  | 'hospitalization'
  | 'deworming'
  | 'boarding'
  | 'training'

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
    case 'consultation':
      return 'Consulta'
    case 'vaccination':
      return 'Vacunación'
    case 'surgery':
      return 'Cirugía'
    case 'grooming':
      return 'Peluquería'
    case 'hospitalization':
      return 'Hospitalización'
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
