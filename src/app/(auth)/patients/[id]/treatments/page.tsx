'use client'

import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Activity, Plus, Stethoscope } from 'lucide-react'

export default function PatientTreatmentsPage() {
  const params = useParams()
  const patientId = params.id as string

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Tratamientos</h2>
          <p className="text-muted-foreground">
            Procedimientos y tratamientos realizados
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Tratamiento
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Tratamientos activos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Tratamientos Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              No hay tratamientos activos
            </p>
          </CardContent>
        </Card>

        {/* Historial de tratamientos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Historial de Tratamientos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              No hay tratamientos completados registrados
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
