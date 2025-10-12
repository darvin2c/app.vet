'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Stethoscope,
  Upload,
  FileText,
  ClipboardList,
} from 'lucide-react'
import { AppointmentCreate } from '@/components/appointments/appointment-create'
import { TreatmentPlanCreate } from '@/components/treatment_plans/treatment-plan-create'

interface PatientQuickActionsProps {
  patientId: string
}

export function PatientQuickActions({ patientId }: PatientQuickActionsProps) {
  const [showAppointmentCreate, setShowAppointmentCreate] = useState(false)
  const [showTreatmentPlanCreate, setShowTreatmentPlanCreate] = useState(false)

  const handleNewAppointment = () => {
    setShowAppointmentCreate(true)
  }

  const handleNewTreatmentPlan = () => {
    setShowTreatmentPlanCreate(true)
  }

  const handleUploadFile = () => {
    // TODO: Implementar modal/drawer para subir archivo
    console.log('Subir archivo para paciente:', patientId)
  }

  const handleNewNote = () => {
    // TODO: Implementar modal/drawer para nueva nota clínica
    console.log('Nueva nota clínica para paciente:', patientId)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={handleNewAppointment}
            >
              <Calendar className="h-6 w-6" />
              <span className="text-sm">Nueva Cita</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={handleNewTreatmentPlan}
            >
              <ClipboardList className="h-6 w-6" />
              <span className="text-sm">Plan de Tratamiento</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={handleNewNote}
            >
              <FileText className="h-6 w-6" />
              <span className="text-sm">Nueva Nota</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={handleUploadFile}
            >
              <Upload className="h-6 w-6" />
              <span className="text-sm">Subir Archivo</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <AppointmentCreate
        open={showAppointmentCreate}
        onOpenChange={setShowAppointmentCreate}
        onSuccess={() => setShowAppointmentCreate(false)}
        defaultPatientId={patientId}
      />

      <TreatmentPlanCreate
        open={showTreatmentPlanCreate}
        onOpenChange={setShowTreatmentPlanCreate}
        onSuccess={() => setShowTreatmentPlanCreate(false)}
        defaultPatientId={patientId}
      />
    </>
  )
}
