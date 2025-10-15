import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface PetStatusBadgeProps {
  status: string
  className?: string
}

export function PetStatusBadge({ status, className }: PetStatusBadgeProps) {
  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'activo':
        return 'default'
      case 'inactive':
      case 'inactivo':
        return 'secondary'
      case 'deceased':
      case 'fallecido':
        return 'destructive'
      case 'lost':
      case 'perdido':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'Activo'
      case 'inactive':
        return 'Inactivo'
      case 'deceased':
        return 'Fallecido'
      case 'lost':
        return 'Perdido'
      default:
        return status || 'Sin estado'
    }
  }

  return (
    <Badge variant={getStatusVariant(status)} className={cn(className)}>
      {getStatusText(status)}
    </Badge>
  )
}
