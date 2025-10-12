import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { format, addMinutes, startOfDay, endOfDay, parseISO } from 'date-fns'

interface UseAvailableTimeSlotsProps {
  date?: Date
  staffId?: string
  excludeAppointmentId?: string
}

export function useAvailableTimeSlots({
  date,
  staffId,
  excludeAppointmentId,
}: UseAvailableTimeSlotsProps) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: ['available-time-slots', date, staffId, excludeAppointmentId],
    queryFn: async () => {
      if (!currentTenant?.id || !date) {
        return []
      }

      // Generate all possible time slots (9:00 to 18:00 in 15-minute intervals)
      const allTimeSlots = Array.from({ length: 37 }, (_, i) => {
        const totalMinutes = i * 15
        const hour = Math.floor(totalMinutes / 60) + 9
        const minute = totalMinutes % 60
        return `${hour.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}`
      })

      // Get existing appointments for the date and staff
      let query = supabase
        .from('appointments')
        .select('start_time, end_time')
        .eq('tenant_id', currentTenant.id)
        .gte('start_time', format(startOfDay(date), 'yyyy-MM-dd HH:mm:ss'))
        .lte('start_time', format(endOfDay(date), 'yyyy-MM-dd HH:mm:ss'))
        .neq('status', 'cancelled')
        .neq('status', 'no_show')

      if (staffId) {
        query = query.eq('staff_id', staffId)
      }

      if (excludeAppointmentId) {
        query = query.neq('id', excludeAppointmentId)
      }

      const { data: appointments, error } = await query

      if (error) {
        throw new Error(`Error al obtener citas: ${error.message}`)
      }

      // Filter out occupied time slots
      const occupiedSlots = new Set<string>()

      appointments?.forEach((appointment) => {
        const startTime = parseISO(appointment.start_time)
        const endTime = parseISO(appointment.end_time)

        // Mark all 15-minute slots between start and end as occupied
        let current = startTime
        while (current < endTime) {
          const timeSlot = format(current, 'HH:mm')
          occupiedSlots.add(timeSlot)
          current = addMinutes(current, 15)
        }
      })

      // Return available time slots
      return allTimeSlots.filter((slot) => !occupiedSlots.has(slot))
    },
    enabled: !!currentTenant?.id && !!date,
  })
}
