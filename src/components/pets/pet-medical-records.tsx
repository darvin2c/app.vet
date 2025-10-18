'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Activity,
  Scissors,
  GraduationCap,
  Pill,
  Shield,
  FileText,
} from 'lucide-react'

import { PetClinicalParameters } from './pet-clinical-parameters'
import { PetSurgeries } from './pet-surgeries'
import { PetTrainings } from './pet-trainings'
import { PetMedicalRecordItems } from './pet-medical-record-items'
import { PetVaccinations } from './pet-vaccinations'
import { MedicalRecordCreateButton } from '../medical-records/medical-record-create-button'
import { PetMedicalRecordsList } from './pet-treatments-list'
import { usePetMedicalRecords } from '@/hooks/pets/use-pet-medical-records'
import { ClinicalParameterCreateButton } from '../clinical-parameters/clinical-parameter-create-button'

interface PetMedicalRecordsProps {
  petId: string
}

export function PetMedicalRecords({ petId }: PetMedicalRecordsProps) {
  const [activeView, setActiveView] = useState('all')
  const { data: medicalRecords = [] } = usePetMedicalRecords(petId)

  // Calcular contadores dinámicos por tipo de registro médico
  const recordCounts = {
    clinical: medicalRecords.reduce(
      (count, record) => count + record.clinical_parameters.length,
      0
    ),
    surgeries: 0, // Los registros de cirugías se manejan por separado
    trainings: 0, // Los registros de entrenamientos se manejan por separado
    medications: 0, // Los registros de medicamentos se manejan por separado
    vaccinations: 0, // Los registros de vacunas se manejan por separado
    total: medicalRecords.length,
  }

  // Obtener todos los parámetros clínicos de todos los registros médicos
  const allClinicalParameters = medicalRecords.flatMap(
    (record) => record.clinical_parameters
  )

  const treatmentCards = [
    {
      title: 'Parámetros Clínicos',
      count: recordCounts.clinical,
      icon: Activity,
      color: 'bg-blue-500',
    },
    {
      title: 'Cirugías',
      count: recordCounts.surgeries,
      icon: Scissors,
      color: 'bg-red-500',
    },
    {
      title: 'Entrenamientos',
      count: recordCounts.trainings,
      icon: GraduationCap,
      color: 'bg-green-500',
    },
    {
      title: 'Medicamentos',
      count: recordCounts.medications,
      icon: Pill,
      color: 'bg-purple-500',
    },
    {
      title: 'Vacunas',
      count: recordCounts.vaccinations,
      icon: Shield,
      color: 'bg-yellow-500',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Registros Médicos
          </h2>
          <p className="text-muted-foreground">
            Historial completo de tratamientos y procedimientos médicos
          </p>
        </div>
        <MedicalRecordCreateButton petId={petId} />
      </div>
      <PetMedicalRecordsList
        petId={petId}
        medicalRecords={medicalRecords}
        isLoading={false}
      />
    </div>
  )
}
