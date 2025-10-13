import { Tables } from './supabase.types'

// Tipo común para appointments con relaciones
export type AppointmentWithRelations = Tables<'appointments'> & {
  pets:
    | (Tables<'pets'> & {
        customers: Tables<'customers'> | null
      })
    | null
  staff: Tables<'staff'> | null
  appointment_types: Tables<'appointment_types'> | null
}
