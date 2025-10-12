'use client'

import { Badge } from '@/components/ui/badge'
import {
  TreatmentPlanStatus,
  TreatmentPlanItemStatus,
} from '@/schemas/treatment-plans.schema'
import { cn } from '@/lib/utils'

interface TreatmentPlanStatusBadgeProps {
  status: TreatmentPlanStatus
  className?: string
}

interface TreatmentPlanItemStatusBadgeProps {
  status: TreatmentPlanItemStatus
  className?: string
}

const PLAN_STATUS_CONFIG: Record<
  TreatmentPlanStatus,
  {
    label: string
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
    className: string
  }
> = {
  draft: {
    label: 'Borrador',
    variant: 'outline',
    className: 'border-gray-300 text-gray-600 bg-gray-50',
  },
  proposed: {
    label: 'Propuesto',
    variant: 'default',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  accepted: {
    label: 'Aceptado',
    variant: 'default',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  partially_accepted: {
    label: 'Parcialmente Aceptado',
    variant: 'default',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  rejected: {
    label: 'Rechazado',
    variant: 'destructive',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
  completed: {
    label: 'Completado',
    variant: 'default',
    className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  cancelled: {
    label: 'Cancelado',
    variant: 'secondary',
    className: 'bg-gray-100 text-gray-800 border-gray-200',
  },
}

const ITEM_STATUS_CONFIG: Record<
  TreatmentPlanItemStatus,
  {
    label: string
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
    className: string
  }
> = {
  planned: {
    label: 'Planificado',
    variant: 'outline',
    className: 'border-blue-200 text-blue-700 bg-blue-50',
  },
  accepted: {
    label: 'Aceptado',
    variant: 'default',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  rejected: {
    label: 'Rechazado',
    variant: 'destructive',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
  scheduled: {
    label: 'Programado',
    variant: 'outline',
    className: 'border-purple-200 text-purple-700 bg-purple-50',
  },
  in_progress: {
    label: 'En Progreso',
    variant: 'outline',
    className: 'border-orange-200 text-orange-700 bg-orange-50',
  },
  completed: {
    label: 'Completado',
    variant: 'default',
    className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  cancelled: {
    label: 'Cancelado',
    variant: 'secondary',
    className: 'bg-gray-100 text-gray-800 border-gray-200',
  },
}

export function TreatmentPlanStatusBadge({
  status,
  className,
}: TreatmentPlanStatusBadgeProps) {
  const config = PLAN_STATUS_CONFIG[status]

  return (
    <Badge variant={config.variant} className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}

export function TreatmentPlanItemStatusBadge({
  status,
  className,
}: TreatmentPlanItemStatusBadgeProps) {
  const config = ITEM_STATUS_CONFIG[status]

  return (
    <Badge variant={config.variant} className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}
