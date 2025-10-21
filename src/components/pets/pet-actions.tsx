'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Camera,
  Activity,
  FileText,
  Calendar,
  Download,
} from 'lucide-react'
import { Tables } from '@/types/supabase.types'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PetEdit } from './pet-edit'
import { PetDelete } from './pet-delete'

interface PetActionsProps {
  pet: Tables<'pets'>
  variant?: 'ghost' | 'outline'
  size?: 'sm' | 'default'
  onEdit?: () => void
  onAddPhoto?: () => void
  onChangeStatus?: () => void
  onViewHistory?: () => void
  onScheduleAppointment?: () => void
  onGenerateReport?: () => void
  onDelete?: () => void
}

export function PetActions({
  pet,
  variant = 'ghost',
  size = 'default',
  onEdit,
  onAddPhoto,
  onChangeStatus,
  onViewHistory,
  onScheduleAppointment,
  onGenerateReport,
  onDelete,
}: PetActionsProps) {
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const router = useRouter()

  const handleViewProfile = () => {
    router.push(`/pets/${pet.id}`)
  }

  const handleEdit = () => {
    if (onEdit) {
      onEdit()
    } else {
      setShowEdit(true)
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete()
    } else {
      setShowDelete(true)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={variant === 'ghost' ? 'h-8 w-8 p-0' : 'p-2 md:px-3'}
          >
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {/* Acción Ver Perfil - solo para listas */}
          {variant === 'ghost' && (
            <>
              <DropdownMenuItem onClick={handleViewProfile}>
                <Eye className="mr-2 h-4 w-4" />
                Ver Perfil
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          {/* Editar información básica */}
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            <span>
              {variant === 'outline' ? 'Editar información básica' : 'Editar'}
            </span>
          </DropdownMenuItem>

          {/* Acciones adicionales para el header */}
          {variant === 'outline' && (
            <>
              {onAddPhoto && (
                <DropdownMenuItem onClick={onAddPhoto}>
                  <Camera className="mr-2 h-4 w-4" />
                  <span>Agregar foto</span>
                </DropdownMenuItem>
              )}

              {onChangeStatus && (
                <DropdownMenuItem onClick={onChangeStatus}>
                  <Activity className="mr-2 h-4 w-4" />
                  <span>Cambiar estado</span>
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              {onViewHistory && (
                <DropdownMenuItem onClick={onViewHistory}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Ver historial médico completo</span>
                </DropdownMenuItem>
              )}

              {onScheduleAppointment && (
                <DropdownMenuItem onClick={onScheduleAppointment}>
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Programar cita</span>
                </DropdownMenuItem>
              )}

              {onGenerateReport && (
                <DropdownMenuItem onClick={onGenerateReport}>
                  <Download className="mr-2 h-4 w-4" />
                  <span>Generar reporte</span>
                </DropdownMenuItem>
              )}
            </>
          )}

          <DropdownMenuSeparator />

          {/* Eliminar */}
          <DropdownMenuItem onClick={handleDelete} className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            <span>
              {variant === 'outline' ? 'Eliminar mascota' : 'Eliminar'}
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modales - solo se muestran si no hay callbacks personalizados */}
      {!onEdit && (
        <PetEdit pet={pet} open={showEdit} onOpenChange={setShowEdit} />
      )}

      {!onDelete && (
        <PetDelete pet={pet} open={showDelete} onOpenChange={setShowDelete} />
      )}
    </>
  )
}
