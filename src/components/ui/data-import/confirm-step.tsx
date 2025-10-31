import { CheckCircle, RefreshCw, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ConfirmStepProps {
  validCount: number
  isLoading?: boolean
  onReset: () => void
  error?: string | null
}

export function ConfirmStep({
  validCount,
  isLoading = false,
  onReset,
  error,
}: ConfirmStepProps) {
  return (
    <div className="space-y-6 text-center">
      <div className="flex flex-col items-center space-y-4">
        {isLoading ? (
          <>
            <RefreshCw className="h-16 w-16 text-blue-600 animate-spin" />
            <h3 className="text-lg font-semibold">Importando datos...</h3>
            <p className="text-sm text-muted-foreground">
              Por favor espera mientras procesamos {validCount} registros
            </p>
          </>
        ) : error ? (
          <>
            <AlertCircle className="h-16 w-16 text-red-600" />
            <h3 className="text-lg font-semibold text-red-600">
              Error en la importación
            </h3>
            <p className="text-sm text-red-600">{error}</p>
          </>
        ) : (
          <>
            <CheckCircle className="h-16 w-16 text-green-600" />
            <h3 className="text-lg font-semibold text-green-600">
              ¡Importación completada!
            </h3>
            <p className="text-sm text-muted-foreground">
              Se han importado exitosamente {validCount} registros
            </p>
          </>
        )}
      </div>

      {!isLoading && (
        <div className="flex justify-center">
          <Button onClick={onReset} variant="outline">
            Importar más datos
          </Button>
        </div>
      )}
    </div>
  )
}
