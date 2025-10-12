'use client'

import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Plus, Edit } from 'lucide-react'

export default function PatientNotesPage() {
  const params = useParams()
  const patientId = params.id as string

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Notas Clínicas</h2>
          <p className="text-muted-foreground">
            Evolución clínica y notas médicas
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Nota
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Notas recientes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Notas Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              No hay notas clínicas registradas
            </p>
          </CardContent>
        </Card>

        {/* Evolución clínica */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Evolución Clínica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              No hay evolución clínica registrada
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
