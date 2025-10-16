import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  Stethoscope,
  Calendar,
  User,
  FileText,
  Syringe,
  Scissors,
  GraduationCap,
  Package,
  Activity,
  Building,
  Search,
  Filter,
} from 'lucide-react'
import { Tables } from '@/types/supabase.types'

// Import existing components
import { PetClinicalParameters } from './pet-clinical-parameters'
import { PetSurgeries } from './pet-surgeries'
import { PetTrainings } from './pet-trainings'
import { PetTreatmentItems } from './pet-treatment-items'
import { PetVaccinations } from './pet-vaccinations'
import { TreatmentCreateButton } from '@/components/treatments/treatment-create-button'

interface PetAllTreatmentsProps {
  petId: string
}

const treatmentTypeIcons = {
  vaccination: Syringe,
  surgery: Scissors,
  training: GraduationCap,
  clinical: Activity,
  items: Package,
}

const treatmentTypeLabels = {
  vaccination: 'Vacunación',
  surgery: 'Cirugía',
  training: 'Entrenamiento',
  clinical: 'Parámetros Clínicos',
  items: 'Medicamentos',
}

export function PetAllTreatments({ petId }: PetAllTreatmentsProps) {
  const [activeView, setActiveView] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Historial de Tratamientos</h2>
          <p className="text-muted-foreground">
            Todos los tratamientos y procedimientos realizados
          </p>
        </div>
        <div className="flex gap-2">
          <TreatmentCreateButton />
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar tratamientos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            <SelectItem value="consultation">Consultas</SelectItem>
            <SelectItem value="vaccination">Vacunaciones</SelectItem>
            <SelectItem value="surgery">Cirugías</SelectItem>
            <SelectItem value="training">Entrenamientos</SelectItem>
            <SelectItem value="clinical">Parámetros Clínicos</SelectItem>
            <SelectItem value="items">Medicamentos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Treatment Views */}
      <Tabs
        value={activeView}
        onValueChange={setActiveView}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            <span className="hidden sm:inline">Todos</span>
          </TabsTrigger>
          <TabsTrigger value="clinical" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Clínico</span>
          </TabsTrigger>
          <TabsTrigger value="surgeries" className="flex items-center gap-2">
            <Scissors className="h-4 w-4" />
            <span className="hidden sm:inline">Cirugías</span>
          </TabsTrigger>
          <TabsTrigger value="trainings" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">Entrenamientos</span>
          </TabsTrigger>
          <TabsTrigger value="items" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Medicamentos</span>
          </TabsTrigger>
          <TabsTrigger value="vaccinations" className="flex items-center gap-2">
            <Syringe className="h-4 w-4" />
            <span className="hidden sm:inline">Vacunas</span>
          </TabsTrigger>
        </TabsList>

        {/* All Treatments Overview */}
        <TabsContent value="all" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Resumen de Tratamientos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Activity className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">
                    Parámetros Clínicos
                  </div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Syringe className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Vacunas</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Scissors className="h-8 w-8 mx-auto mb-2 text-red-500" />
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Cirugías</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Package className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">
                    Medicamentos
                  </div>
                </div>
              </div>

              <div className="text-center py-8 text-muted-foreground">
                <Stethoscope className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No hay tratamientos registrados
                </h3>
                <p className="text-muted-foreground mb-4">
                  Los tratamientos aparecerán aquí una vez que sean registrados.
                </p>
                <TreatmentCreateButton />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clinical Parameters */}
        <TabsContent value="clinical" className="space-y-6">
          <PetClinicalParameters
            parameters={[]}
            isLoading={false}
            petId={petId}
          />
        </TabsContent>

        {/* Surgeries */}
        <TabsContent value="surgeries" className="space-y-6">
          <PetSurgeries petId={petId} />
        </TabsContent>

        {/* Trainings */}
        <TabsContent value="trainings" className="space-y-6">
          <PetTrainings petId={petId} />
        </TabsContent>

        {/* Treatment Items */}
        <TabsContent value="items" className="space-y-6">
          <PetTreatmentItems petId={petId} />
        </TabsContent>

        {/* Vaccinations */}
        <TabsContent value="vaccinations" className="space-y-6">
          <PetVaccinations petId={petId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
