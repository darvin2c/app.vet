import { Tables } from './supabase.types'

// Tipo común para appointments con relaciones
export type AppointmentWithRelations = Tables<'appointments'> & {
  pets: (Tables<'pets'> & {
    clients: Tables<'clients'> | null
  }) | null
  staff: Tables<'staff'> | null
  appointment_types: Tables<'appointment_types'> | null
}
