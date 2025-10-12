'use client'

import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Paperclip, Upload, Image, FileText } from 'lucide-react'

export default function PatientAttachmentsPage() {
  const params = useParams()
  const patientId = params.id as string

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Adjuntos</h2>
          <p className="text-muted-foreground">
            Archivos médicos, radiografías y documentos
          </p>
        </div>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Subir Archivo
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Radiografías */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Radiografías
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              No hay radiografías cargadas
            </p>
          </CardContent>
        </Card>

        {/* Documentos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              No hay documentos cargados
            </p>
          </CardContent>
        </Card>

        {/* Otros archivos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Paperclip className="h-5 w-5" />
              Otros Archivos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              No hay otros archivos cargados
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
