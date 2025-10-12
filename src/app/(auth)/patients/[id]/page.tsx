'use client'

import { useParams } from 'next/navigation'
import { PatientProfileHeader } from '@/components/patients/patient-profile-header'
import { PatientQuickActions } from '@/components/patients/patient-quick-actions'
import { PatientAppointmentsSummary } from '@/components/patients/patient-appointments-summary'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { usePatientDetail } from '@/hooks/patients/use-patient-detail'

export default function PatientProfilePage() {
  const params = useParams()
  const patientId = params.id as string

  const { data: patient, isLoading, error } = usePatientDetail(patientId)

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (error || !patient) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              {error ? 'Error al cargar el paciente' : 'Paciente no encontrado'}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header con datos básicos del paciente */}
      <PatientProfileHeader patient={patient} />

      {/* Acciones rápidas */}
      <PatientQuickActions patientId={patientId} />

      {/* Resumen de citas */}
      <PatientAppointmentsSummary patientId={patientId} />
    </div>
  )
}
