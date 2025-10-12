'use client'

import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { Database } from '@/types/supabase.types'
import useDeleteProcedure from '@/hooks/procedures/use-delete-procedure'

type Procedure = Database['public']['Tables']['procedures']['Row']

interface ProcedureDeleteProps {
  procedure: Procedure
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProcedureDelete({
  procedure,
  open,
  onOpenChange,
}: ProcedureDeleteProps) {
  const deleteProcedure = useDeleteProcedure()

  const handleConfirm = async () => {
    await deleteProcedure.mutateAsync(procedure.id)
    onOpenChange(false)
  }

  const procedureName = procedure.name

  return (
    <AlertConfirmation
      isOpen={open}
      onClose={() => onOpenChange(false)}
      onConfirm={handleConfirm}
      title="Eliminar Procedimiento"
      description={`¿Estás seguro de que deseas eliminar el procedimiento "${procedureName}"? Esta acción no se puede deshacer y se perderán todos los datos asociados.`}
      confirmText="ELIMINAR"
      isLoading={deleteProcedure.isPending}
    />
  )
}
