import { useQuery } from '@tanstack/react-query'

interface UseAvailableTimeSlotsParams {
  date?: Date
  staffId?: string
}

export function useAvailableTimeSlots(params: UseAvailableTimeSlotsParams) {
  return useQuery({
    queryKey: ['available-time-slots', params],
    queryFn: async () => {
      // TODO: Implementar lógica para obtener slots disponibles
      return []
    },
    enabled: !!params.date && !!params.staffId,
  })
}