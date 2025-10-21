import {
  ArrowLeft,
  MoreVertical,
  Camera,
  Activity,
  FileText,
  Download,
  Trash2,
  Calendar,
  Edit,
  Menu,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import { Tables } from '@/types/supabase.types'
import { PetStatusBadge } from './pet-status-badge'
import {
  calculateAge,
  getSexIcon,
  getSexColor,
  formatDate,
  formatWeight,
} from '@/lib/pet-utils'

type PetDetail = Tables<'pets'> & {
  customers: Tables<'customers'> | null
  breeds:
    | (Tables<'breeds'> & {
        species: Tables<'species'> | null
      })
    | null
  species: Tables<'species'> | null
}

interface PetProfileHeaderProps {
  pet: PetDetail
  onMenuClick?: () => void
  onEdit?: () => void
  onAddPhoto?: () => void
  onChangeStatus?: () => void
  onViewHistory?: () => void
  onScheduleAppointment?: () => void
  onGenerateReport?: () => void
  onDelete?: () => void
}

export function PetProfileHeader({
  pet,
  onMenuClick,
  onEdit,
  onAddPhoto,
  onChangeStatus,
  onViewHistory,
  onScheduleAppointment,
  onGenerateReport,
  onDelete,
}: PetProfileHeaderProps) {
  const router = useRouter()

  return (
    <Card className="mb-4 md:mb-6">
      <CardContent className="p-4 md:p-6">
        {/* Mobile Header Actions */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="p-2 md:px-3"
          >
            <ArrowLeft className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Volver</span>
          </Button>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="p-2 md:px-3">
                  <MoreVertical className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Acciones</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Editar información básica</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onAddPhoto}>
                  <Camera className="mr-2 h-4 w-4" />
                  <span>Agregar foto</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onChangeStatus}>
                  <Activity className="mr-2 h-4 w-4" />
                  <span>Cambiar estado</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onViewHistory}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Ver historial médico completo</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onScheduleAppointment}>
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Programar cita</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onGenerateReport}>
                  <Download className="mr-2 h-4 w-4" />
                  <span>Generar reporte</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onDelete}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Eliminar mascota</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {onMenuClick && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMenuClick}
                className="p-2 md:hidden"
              >
                <Menu className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Pet Information */}
        <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
          {/* Avatar */}
          <div className="flex justify-center md:justify-start">
            <Avatar className="h-20 w-20 md:h-24 md:w-24">
              <AvatarFallback className="text-xl md:text-2xl">
                {pet.name?.charAt(0)?.toUpperCase() || 'M'}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Pet Details */}
          <div className="flex-1 space-y-3 text-center md:text-left">
            {/* Name and Sex */}
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 md:gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold">{pet.name}</h1>
                <span className={`text-xl md:text-2xl ${getSexColor(pet.sex)}`}>
                  {getSexIcon(pet.sex)}
                </span>
              </div>

              {/* Breed and Species */}
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 text-sm md:text-base text-muted-foreground">
                <span>
                  {pet.breeds?.name ||
                    pet.species?.name ||
                    'Raza no especificada'}
                </span>
                {pet.breeds?.name && pet.species?.name && (
                  <>
                    <span className="hidden md:inline">•</span>
                    <span>{pet.species.name}</span>
                  </>
                )}
              </div>
            </div>

            {/* Age and Birth Date */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm">
              <div className="flex items-center justify-center md:justify-start gap-1">
                <Calendar className="h-4 w-4" />
                <span>{calculateAge(pet.birth_date)}</span>
              </div>
              {pet.birth_date && (
                <div className="text-muted-foreground text-xs md:text-sm">
                  Nacido el {formatDate(pet.birth_date)}
                </div>
              )}
            </div>

            {/* Status and Additional Info */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3">
              <PetStatusBadge status="active" />
              {pet.microchip && (
                <Badge variant="outline" className="text-xs">
                  Microchip: {pet.microchip}
                </Badge>
              )}
              {pet.weight && (
                <Badge variant="outline" className="text-xs">
                  {formatWeight(pet.weight)}
                </Badge>
              )}
            </div>

            {/* Notes */}
            {pet.notes && (
              <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                {pet.notes}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
