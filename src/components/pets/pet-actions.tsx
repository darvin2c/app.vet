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
import { AppointmentCreate } from '@/components/appointments/appointment-create'

interface PetActionsProps {
  pet: Tables<'pets'>
  variant?: 'ghost' | 'outline'
  size?: 'sm' | 'default'
}

export function PetActions({
  pet,
  variant = 'ghost',
  size = 'default',
}: PetActionsProps) {
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showAppointmentCreate, setShowAppointmentCreate] = useState(false)
  const router = useRouter()

  const handleViewProfile = () => {
    router.push(`/pets/${pet.id}`)
  }

  const handleEdit = () => {
    setShowEdit(true)
  }

  const handleDelete = () => {
    setShowDelete(true)
  }

  const handleScheduleAppointment = () => {
    setShowAppointmentCreate(true)
  }

  const handleAddPhoto = () => {
    console.log('Agregar foto para:', pet.name)
    // TODO: Implementar funcionalidad de agregar foto
  }

  const handleChangeStatus = () => {
    console.log('Cambiar estado para:', pet.name)
    // TODO: Implementar funcionalidad de cambiar estado
  }

  const handleViewHistory = () => {
    console.log('Ver historial médico completo para:', pet.name)
    // TODO: Implementar funcionalidad de ver historial médico completo
  }

  const handleGenerateReport = () => {
    console.log('Generar reporte para:', pet.name)
    // TODO: Implementar funcionalidad de generar reporte
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
          <DropdownMenuItem onClick={handleAddPhoto}>
            <Camera className="mr-2 h-4 w-4" />
            <span>Agregar foto</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleViewHistory}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Ver historial médico completo</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleScheduleAppointment}>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Programar cita</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleGenerateReport}>
            <Download className="mr-2 h-4 w-4" />
            <span>Generar reporte</span>
          </DropdownMenuItem>
          {/* Eliminar */}
          <DropdownMenuItem onClick={handleDelete} className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            <span>
              {variant === 'outline' ? 'Eliminar mascota' : 'Eliminar'}
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modales */}
      <PetEdit pet={pet} open={showEdit} onOpenChange={setShowEdit} />

      <PetDelete pet={pet} open={showDelete} onOpenChange={setShowDelete} />

      <AppointmentCreate
        open={showAppointmentCreate}
        onOpenChange={setShowAppointmentCreate}
        defaultPetId={pet.id}
      />
    </>
  )
}
