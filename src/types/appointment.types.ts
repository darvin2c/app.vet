import { Tables } from './supabase.types'

// Tipo común para appointments con relaciones
export type AppointmentWithRelations = Tables<'appointments'> & {
  patients: {
    id: string
    first_name: string
    last_name: string
    email: string | null
    phone: string | null
    date_of_birth: string | null
    address: string | null
    allergies: string | null
    systemic_diseases: string | null
  } | null
  staff: {
    id: string
    first_name: string
    last_name: string
  } | null

  appointment_types: {
    id: string
    name: string
    color: string | null
    code: string | null
    active: boolean
  } | null
}
