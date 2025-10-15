'use client'

import { useFormContext } from 'react-hook-form'
import { useEffect } from 'react'
import {
  AttachmentUploadSchema,
  attachmentTypeEnum,
  attachmentCategoryEnum,
} from '@/schemas/attachments.schema'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X, Plus } from 'lucide-react'
import { useState } from 'react'

interface AttachmentFormProps {
  hideFileInput?: boolean
  allowMultiple?: boolean
}

export function AttachmentForm({
  hideFileInput = false,
  allowMultiple = false,
}: AttachmentFormProps) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useFormContext<AttachmentUploadSchema>()
  const [newTag, setNewTag] = useState('')

  // Watchers para validaciones dinámicas
  const selectedFile = watch('file')
  const attachmentType = watch('attachment_type')
  const currentTags = watch('tags') || []

  // Validar tipo de archivo cuando cambia
  useEffect(() => {
    if (selectedFile && attachmentType) {
      const allowedTypes = {
        image: [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
          'image/svg+xml',
        ],
        document: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
        ],
        video: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'],
        audio: ['audio/mp3', 'audio/wav', 'audio/ogg'],
        other: ['*/*'],
      }

      const isValidType =
        allowedTypes[attachmentType].includes(selectedFile.type) ||
        allowedTypes[attachmentType].includes('*/*')

      if (!isValidType) {
        // Aquí podrías mostrar un error personalizado
        console.warn(
          `Tipo de archivo ${selectedFile.type} no válido para ${attachmentType}`
        )
      }
    }
  }, [selectedFile, attachmentType])

  const handleAddTag = () => {
    if (
      newTag.trim() &&
      !currentTags.includes(newTag.trim()) &&
      currentTags.length < 10
    ) {
      const updatedTags = [...currentTags, newTag.trim()]
      setValue('tags', updatedTags)
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = currentTags.filter((tag) => tag !== tagToRemove)
    setValue('tags', updatedTags)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  // Obtener tipos de archivo permitidos según el tipo seleccionado
  const allowedFileTypes = attachmentType
    ? {
        image: [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
          'image/svg+xml',
        ],
        document: ['.pdf', '.doc', '.docx', '.txt'],
        video: ['.mp4', '.avi', '.mov', '.wmv'],
        audio: ['.mp3', '.wav', '.ogg'],
        other: ['*'],
      }[attachmentType] || []
    : []

  return (
    <div className="space-y-6">
      {/* Archivo */}
      {!hideFileInput && (
        <Field>
          <FieldLabel htmlFor="file">Archivo *</FieldLabel>
          <FieldContent>
            <Input
              id="file"
              type="file"
              accept={allowedFileTypes.join(',')}
              multiple={allowMultiple}
              {...register('file')}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
            <FieldError errors={[errors.file]} />
            {allowedFileTypes.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Tipos permitidos: {allowedFileTypes.join(', ')}
              </p>
            )}
          </FieldContent>
        </Field>
      )}

      {/* Tipo de archivo */}
      <Field>
        <FieldLabel htmlFor="attachment_type">Tipo de archivo *</FieldLabel>
        <FieldContent>
          <Select
            onValueChange={(value) => setValue('attachment_type', value as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona el tipo de archivo" />
            </SelectTrigger>
            <SelectContent>
              {attachmentTypeEnum.options.map((type) => (
                <SelectItem key={type} value={type}>
                  {type === 'image' && 'Imagen'}
                  {type === 'document' && 'Documento'}
                  {type === 'video' && 'Video'}
                  {type === 'audio' && 'Audio'}
                  {type === 'other' && 'Otro'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError errors={[errors.attachment_type]} />
        </FieldContent>
      </Field>

      {/* Categoría médica */}
      <Field>
        <FieldLabel htmlFor="category">Categoría médica</FieldLabel>
        <FieldContent>
          <Select onValueChange={(value) => setValue('category', value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona la categoría médica" />
            </SelectTrigger>
            <SelectContent>
              {attachmentCategoryEnum.options.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === 'xray' && 'Radiografía'}
                  {category === 'ultrasound' && 'Ecografía'}
                  {category === 'blood_test' && 'Análisis de sangre'}
                  {category === 'urine_test' && 'Análisis de orina'}
                  {category === 'biopsy' && 'Biopsia'}
                  {category === 'vaccination_record' &&
                    'Registro de vacunación'}
                  {category === 'medical_report' && 'Reporte médico'}
                  {category === 'prescription' && 'Receta médica'}
                  {category === 'consent_form' &&
                    'Formulario de consentimiento'}
                  {category === 'insurance_document' && 'Documento de seguro'}
                  {category === 'other' && 'Otro'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError errors={[errors.category]} />
        </FieldContent>
      </Field>

      {/* Descripción */}
      <Field>
        <FieldLabel htmlFor="description">Descripción</FieldLabel>
        <FieldContent>
          <Textarea
            id="description"
            placeholder="Describe el contenido del archivo..."
            {...register('description')}
            rows={3}
          />
          <FieldError errors={[errors.description]} />
        </FieldContent>
      </Field>

      {/* Tags */}
      <Field>
        <FieldLabel htmlFor="tags">Etiquetas</FieldLabel>
        <FieldContent>
          <div className="space-y-3">
            {/* Input para agregar tags */}
            <div className="flex gap-2">
              <Input
                placeholder="Agregar etiqueta..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                maxLength={50}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTag}
                disabled={
                  !newTag.trim() ||
                  currentTags.includes(newTag.trim()) ||
                  currentTags.length >= 10
                }
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Lista de tags actuales */}
            {currentTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {currentTags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 hover:bg-transparent"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              {currentTags.length}/10 etiquetas
            </p>
          </div>
          <FieldError errors={[errors.tags]} />
        </FieldContent>
      </Field>

      {/* Información sensible */}
      <Field>
        <FieldContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_sensitive"
              {...register('is_sensitive')}
              onCheckedChange={(checked) => setValue('is_sensitive', !!checked)}
            />
            <FieldLabel htmlFor="is_sensitive" className="text-sm font-normal">
              Marcar como información médica sensible
            </FieldLabel>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Los archivos marcados como sensibles tendrán restricciones
            adicionales de acceso
          </p>
          <FieldError errors={[errors.is_sensitive]} />
        </FieldContent>
      </Field>
    </div>
  )
}
