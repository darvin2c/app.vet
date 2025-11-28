'use client'

import { useState } from 'react'
import { useAttachmentList } from '@/hooks/attachments/use-attachment-list'
import { AttachmentFilters } from '@/schemas/attachments.schema'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { AttachmentActions } from './attachment-actions'
import { AttachmentCreateButton } from './attachment-create-button'
import {
  FileText,
  Image,
  Video,
  Music,
  File,
  Search,
  Eye,
  Download,
  Calendar,
  User,
  Tag,
  Shield,
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface AttachmentListProps {
  medicalRecordId?: string
  showFilters?: boolean
  compact?: boolean
  showCreateButton?: boolean
  maxHeight?: string
}

export function AttachmentList({
  medicalRecordId,
  showFilters = true,
  compact = false,
  showCreateButton = true,
  maxHeight = '600px',
}: AttachmentListProps) {
  const [filters, setFilters] = useState<AttachmentFilters>({
    clinical_record_id: medicalRecordId,
  })
  const [searchTerm, setSearchTerm] = useState('')

  const {
    data: attachments = [],
    isLoading,
    error,
  } = useAttachmentList({
    ...filters,
    search: searchTerm || undefined,
  })

  const getFileIcon = (attachmentType: string) => {
    switch (attachmentType) {
      case 'image':
        return <Image className="h-5 w-5 text-blue-500" />
      case 'video':
        return <Video className="h-5 w-5 text-purple-500" />
      case 'audio':
        return <Music className="h-5 w-5 text-green-500" />
      case 'document':
        return <FileText className="h-5 w-5 text-orange-500" />
      default:
        return <File className="h-5 w-5 text-gray-500" />
    }
  }

  const getCategoryLabel = (category?: string) => {
    const labels: Record<string, string> = {
      xray: 'Radiografía',
      ultrasound: 'Ecografía',
      blood_test: 'Análisis de sangre',
      urine_test: 'Análisis de orina',
      biopsy: 'Biopsia',
      vaccination_record: 'Registro de vacunación',
      medical_report: 'Reporte médico',
      prescription: 'Receta médica',
      consent_form: 'Formulario de consentimiento',
      insurance_document: 'Documento de seguro',
      other: 'Otro',
    }
    return category ? labels[category] || category : 'Sin categoría'
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleViewFile = (fileUrl: string) => {
    window.open(fileUrl, '_blank')
  }

  const handleDownloadFile = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            Error al cargar los archivos adjuntos
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header con filtros y botón crear */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 space-y-2 sm:space-y-0 sm:space-x-2 sm:flex sm:items-center">
          {/* Búsqueda */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar archivos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtros */}
          {showFilters && (
            <div className="flex gap-2">
              <Select
                value={filters.attachment_type || 'all'}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    attachment_type:
                      value === 'all' ? undefined : (value as any),
                  }))
                }
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="image">Imágenes</SelectItem>
                  <SelectItem value="document">Documentos</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="other">Otros</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.category || 'all'}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    category: value === 'all' ? undefined : (value as any),
                  }))
                }
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  <SelectItem value="xray">Radiografía</SelectItem>
                  <SelectItem value="ultrasound">Ecografía</SelectItem>
                  <SelectItem value="blood_test">Análisis de sangre</SelectItem>
                  <SelectItem value="medical_report">Reporte médico</SelectItem>
                  <SelectItem value="prescription">Receta médica</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Botón crear */}
        {showCreateButton && medicalRecordId && (
          <AttachmentCreateButton medicalRecordId={medicalRecordId} />
        )}
      </div>

      {/* Lista de archivos */}
      <div className="space-y-3 overflow-y-auto" style={{ maxHeight }}>
        {isLoading ? (
          // Skeleton loading
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-8" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : attachments.length === 0 ? (
          // Estado vacío
          <Card>
            <CardContent className="p-8 text-center">
              <File className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No hay archivos adjuntos
              </h3>
              <p className="text-muted-foreground mb-4">
                {medicalRecordId
                  ? 'Este registro médico no tiene archivos adjuntos aún.'
                  : 'No se encontraron archivos con los filtros aplicados.'}
              </p>
              {showCreateButton && medicalRecordId && (
                <AttachmentCreateButton medicalRecordId={medicalRecordId} />
              )}
            </CardContent>
          </Card>
        ) : (
          // Lista de archivos
          attachments.map((attachment) => (
            <Card
              key={attachment.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Icono del archivo */}
                  <div className="flex-shrink-0">
                    {getFileIcon(attachment.attachment_type)}
                  </div>

                  {/* Información del archivo */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h4
                          className="font-medium truncate"
                          title={attachment.file_name}
                        >
                          {attachment.file_name}
                        </h4>

                        {attachment.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {attachment.description}
                          </p>
                        )}

                        {/* Metadatos */}
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(
                              new Date(attachment.created_at),
                              'dd MMM yyyy',
                              { locale: es }
                            )}
                          </span>
                          <span>{formatFileSize(attachment.file_size)}</span>
                          {attachment.uploaded_by && (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              Usuario
                            </span>
                          )}
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          <Badge variant="secondary" className="text-xs">
                            {getCategoryLabel(attachment.category)}
                          </Badge>

                          {attachment.is_sensitive && (
                            <Badge
                              variant="destructive"
                              className="text-xs flex items-center gap-1"
                            >
                              <Shield className="h-3 w-3" />
                              Sensible
                            </Badge>
                          )}

                          {attachment.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs flex items-center gap-1"
                            >
                              <Tag className="h-3 w-3" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewFile(attachment.file_url)}
                          title="Ver archivo"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDownloadFile(
                              attachment.file_url,
                              attachment.file_name
                            )
                          }
                          title="Descargar archivo"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <AttachmentActions attachment={attachment} />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Información adicional */}
      {attachments.length > 0 && (
        <div className="text-xs text-muted-foreground text-center">
          {attachments.length} archivo{attachments.length !== 1 ? 's' : ''}{' '}
          encontrado{attachments.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}
