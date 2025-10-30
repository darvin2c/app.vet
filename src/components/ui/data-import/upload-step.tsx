import { useCallback, useState } from 'react'
import { Upload, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface UploadStepProps {
  onFileSelect: (file: File) => void
  onDownloadTemplate: () => void
  fileError: string | null
  acceptedFileTypes?: string[]
  maxFileSize?: number
  templateName?: string
}

export function UploadStep({
  onFileSelect,
  onDownloadTemplate,
  fileError,
  acceptedFileTypes = ['.csv', '.xlsx', '.xls'],
  maxFileSize = 10 * 1024 * 1024, // 10MB
  templateName = 'template.csv',
}: UploadStepProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      // Validar tamaño
      if (file.size > maxFileSize) {
        return
      }

      // Validar tipo
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
      if (!acceptedFileTypes.includes(fileExtension)) {
        return
      }

      onFileSelect(file)
    },
    [onFileSelect, acceptedFileTypes, maxFileSize]
  )

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    // Solo cambiar el estado si realmente salimos del área de drop
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) {
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
        if (
          acceptedFileTypes.includes(fileExtension) &&
          file.size <= maxFileSize
        ) {
          onFileSelect(file)
        }
      }
    },
    [onFileSelect, acceptedFileTypes, maxFileSize]
  )

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Subir Archivo</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Selecciona un archivo CSV o Excel para importar datos
        </p>
      </div>

      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ease-in-out",
          isDragOver
            ? "border-primary bg-primary/5 border-solid shadow-md"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Upload 
          className={cn(
            "mx-auto h-12 w-12 mb-4 transition-colors duration-200",
            isDragOver ? "text-primary" : "text-muted-foreground"
          )} 
        />
        <div className="space-y-2">
          <p className={cn(
            "text-sm font-medium transition-colors duration-200",
            isDragOver ? "text-primary" : ""
          )}>
            {isDragOver 
              ? "Suelta el archivo aquí" 
              : "Arrastra y suelta tu archivo aquí, o haz clic para seleccionar"
            }
          </p>
          <p className="text-xs text-muted-foreground">
            Formatos soportados: {acceptedFileTypes.join(', ')} (máx.{' '}
            {Math.round(maxFileSize / 1024 / 1024)}MB)
          </p>
        </div>
        <Input
          type="file"
          accept={acceptedFileTypes.join(',')}
          onChange={handleFileChange}
          className="mt-4 cursor-pointer"
        />
      </div>

      {fileError && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          {fileError}
        </div>
      )}

      <div className="flex items-center justify-center">
        <Button
          variant="outline"
          onClick={onDownloadTemplate}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Descargar plantilla ({templateName})
        </Button>
      </div>
    </div>
  )
}
