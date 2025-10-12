'use client'

import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { TreatmentPlanEdit } from './treatment-plan-edit'
import { TreatmentPlanDelete } from './treatment-plan-delete'
import { TreatmentPlanItemsList } from './treatment-plan-items-list'
import { TreatmentPlanWithRelations } from '@/hooks/treatment-plans/use-treatment-plans'
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  FileText,
  CheckCircle,
  XCircle,
  Plus,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import useUpdateTreatmentPlan from '@/hooks/treatment-plans/use-update-treatment-plan'
import { canTransitionPlanStatus } from '@/schemas/treatment-plans.schema'

interface TreatmentPlanActionsProps {
  treatmentPlan: TreatmentPlanWithRelations
}

export function TreatmentPlanActions({
  treatmentPlan,
}: TreatmentPlanActionsProps) {
  const router = useRouter()
  const [showEdit, setShowEdit] = useState(false)
  const [showAddProcedure, setShowAddProcedure] = useState(false)
  const [showItemsList, setShowItemsList] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const updateTreatmentPlan = useUpdateTreatmentPlan()

  const handleViewDetail = () => {
    router.push(`/treatment-plans/${treatmentPlan.id}`)
  }

  const handlePropose = async () => {
    if (canTransitionPlanStatus(treatmentPlan.status as any, 'proposed')) {
      await updateTreatmentPlan.mutateAsync({
        id: treatmentPlan.id,
        title: treatmentPlan.title,
        subtotal: treatmentPlan.subtotal,
        discount: treatmentPlan.discount,
        status: 'proposed',
        items: [],
      })
    }
  }

  const handleAccept = async () => {
    if (canTransitionPlanStatus(treatmentPlan.status as any, 'accepted')) {
      await updateTreatmentPlan.mutateAsync({
        id: treatmentPlan.id,
        title: treatmentPlan.title,
        subtotal: treatmentPlan.subtotal,
        discount: treatmentPlan.discount,
        status: 'accepted',
        items: [],
      })
    }
  }

  const handleReject = async () => {
    if (canTransitionPlanStatus(treatmentPlan.status as any, 'rejected')) {
      await updateTreatmentPlan.mutateAsync({
        id: treatmentPlan.id,
        title: treatmentPlan.title,
        subtotal: treatmentPlan.subtotal,
        discount: treatmentPlan.discount,
        status: 'rejected',
        items: [],
      })
    }
  }

  const canPropose = canTransitionPlanStatus(
    treatmentPlan.status as any,
    'proposed'
  )
  const canAccept = canTransitionPlanStatus(
    treatmentPlan.status as any,
    'accepted'
  )
  const canReject = canTransitionPlanStatus(
    treatmentPlan.status as any,
    'rejected'
  )
  const canEdit = ['draft', 'proposed'].includes(treatmentPlan.status)
  const canDelete = ['draft'].includes(treatmentPlan.status)
  const canAddProcedure = ['draft', 'proposed'].includes(treatmentPlan.status)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleViewDetail}>
            <Eye className="mr-2 h-4 w-4" />
            Ver Detalle
          </DropdownMenuItem>

          {canEdit && (
            <DropdownMenuItem onClick={() => setShowEdit(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
          )}

          {canAddProcedure && (
            <DropdownMenuItem onClick={() => setShowItemsList(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Tratamientos
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          {canPropose && (
            <DropdownMenuItem onClick={handlePropose}>
              <FileText className="mr-2 h-4 w-4" />
              Proponer Plan
            </DropdownMenuItem>
          )}

          {canAccept && (
            <DropdownMenuItem onClick={handleAccept}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Aceptar Plan
            </DropdownMenuItem>
          )}

          {canReject && (
            <DropdownMenuItem onClick={handleReject}>
              <XCircle className="mr-2 h-4 w-4" />
              Rechazar Plan
            </DropdownMenuItem>
          )}

          {(canPropose || canAccept || canReject) && canDelete && (
            <DropdownMenuSeparator />
          )}

          {canDelete && (
            <DropdownMenuItem
              onClick={() => setShowDelete(true)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <TreatmentPlanEdit
        treatmentPlan={treatmentPlan}
        open={showEdit}
        onOpenChange={setShowEdit}
        onSuccess={() => setShowEdit(false)}
      />

      <TreatmentPlanDelete
        treatmentPlan={treatmentPlan}
        open={showDelete}
        onOpenChange={setShowDelete}
        onSuccess={() => setShowDelete(false)}
      />

      <TreatmentPlanItemsList
        planId={treatmentPlan.id}
        open={showItemsList}
        onOpenChange={setShowItemsList}
      />
    </>
  )
}
