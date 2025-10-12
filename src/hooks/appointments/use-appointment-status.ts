'use client'

const APPOINTMENT_STATUSES: readonly {
  value: string
  label: string
  color: string
}[] = [
  { value: 'scheduled', label: 'Programada', color: '#FFD700' },
  { value: 'confirmed', label: 'Confirmada', color: '#22C55E' },
  { value: 'in_progress', label: 'En Progreso', color: '#007BFF' },
  { value: 'completed', label: 'Completada', color: '#22C55E' },
  { value: 'cancelled', label: 'Cancelada', color: '#FF4D4F' },
  { value: 'no_show', label: 'No Asistió', color: '#FFA500' },
] as const

export default function useAppointmentStatus() {
  const getStatus = (status: string) => {
    const statusItem = APPOINTMENT_STATUSES.find(
      (item) => item.value === status
    )
    return statusItem?.label || ''
  }

  return {
    statusList: APPOINTMENT_STATUSES,
    getStatus,
  }
}
