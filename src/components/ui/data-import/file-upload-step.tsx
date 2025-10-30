import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, AlertCircle, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { downloadTemplate } from './template-generator'
import type { FileUploadStepProps } from '@/types/data-import.types'

export function FileUploadStep<T = any>({
  onFileSelect,
  acceptedTypes,
  maxSize,
  isLoading = false,
  error,
  config,
}: FileUploadStepProps<T>) {
  // Función para obtener el tipo MIME basado en la extensión
  const getMimeType = (extension: string) => {
    switch (extension) {
      case '.csv':
        return 'text/csv'
      case '.xlsx':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      case '.xls':
        return 'application/vnd.ms-excel'
      default:
        return 'application/octet-stream'
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleDownloadTemplate = useCallback(
    (format: 'csv' | 'xlsx') => {
      if (!config) return

      try {
        downloadTemplate(config, {
          format,
          includeExampleRows: true,
          exampleRowsCount: 2,
        })
      } catch (error) {
        console.error('Error al descargar plantilla:', error)
      }
    },
    [config]
  )

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0])
      }
    },
    [onFileSelect]
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: acceptedTypes.reduce(
        (acc, type) => {
          acc[getMimeType(type)] = [type]
          return acc
        },
        {} as Record<string, string[]>
      ),
      maxSize,
      multiple: false,
      disabled: isLoading,
    })

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900">Subir Archivo</h2>
        <p className="mt-2 text-sm text-gray-600">
          Selecciona o arrastra un archivo para importar datos
        </p>
      </div>

      {/* Sección de descarga de plantilla */}
      {config && (
        <Card className="w-full max-w-2xl mx-auto mb-6">
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                ¿No tienes un archivo listo?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Descarga una plantilla con la estructura correcta para importar
                tus datos
              </p>
              <div className="flex justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadTemplate('csv')}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Descargar CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadTemplate('xlsx')}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Descargar Excel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`
              relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive && !isDragReject ? 'border-blue-400 bg-blue-50' : ''}
              ${isDragReject ? 'border-red-400 bg-red-50' : ''}
              ${!isDragActive && !isDragReject ? 'border-gray-300 hover:border-gray-400' : ''}
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input {...getInputProps()} />

            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 text-gray-400">
                {isLoading ? (
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                ) : (
                  <Upload className="w-12 h-12" />
                )}
              </div>

              <div>
                {isDragActive ? (
                  <p className="text-lg font-medium text-blue-600">
                    {isDragReject
                      ? 'Tipo de archivo no válido'
                      : 'Suelta el archivo aquí'}
                  </p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-gray-900">
                      Arrastra y suelta tu archivo aquí
                    </p>
                    <p className="text-sm text-gray-500">
                      o haz clic para seleccionar
                    </p>
                  </div>
                )}
              </div>

              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                className="mt-4"
              >
                <FileText className="w-4 h-4 mr-2" />
                Seleccionar Archivo
              </Button>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="text-sm text-gray-600">
              <p className="font-medium">Tipos de archivo permitidos:</p>
              <p>{acceptedTypes.join(', ')}</p>
            </div>

            <div className="text-sm text-gray-600">
              <p className="font-medium">Tamaño máximo:</p>
              <p>{formatFileSize(maxSize)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="max-w-2xl mx-auto">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            Consejos para una importación exitosa:
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • Asegúrate de que la primera fila contenga los nombres de las
              columnas
            </li>
            <li>• Verifica que los datos estén en el formato correcto</li>
            <li>• Elimina filas vacías o con datos incompletos</li>
            <li>• Usa fechas en formato YYYY-MM-DD</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
