import PageBase from '@/components/page-base'
import { ReferenceItem } from '@/components/references/reference-item'
import { ReferenceList } from '@/components/references/reference-list'
import { Calendar, Package, Ruler, Stethoscope, Tag } from 'lucide-react'

export default function ReferencesPage() {
  return (
    <PageBase
      title="Referencias del Sistema"
      subtitle="Gestiona las referencias y configuraciones básicas del sistema"
    >
      <ReferenceList>
        <ReferenceItem
          title="Especialidades"
          description="Gestiona las especialidades médicas disponibles para el personal veterinario"
          href="/references/specialties"
          icon={Stethoscope}
        />

        <ReferenceItem
          title="Tipos de Cita"
          description="Configura los diferentes tipos de citas disponibles en el sistema"
          href="/references/appointment-types"
          icon={Calendar}
        />

        <ReferenceItem
          title="Categorías de Productos"
          description="Organiza los productos en categorías para una mejor gestión del inventario"
          href="/references/product-categories"
          icon={Package}
        />

        <ReferenceItem
          title="Marcas de Productos"
          description="Administra las marcas de productos disponibles en el inventario"
          href="/references/product-brands"
          icon={Tag}
        />

        <ReferenceItem
          title="Unidades de Productos"
          description="Define las unidades de medida utilizadas para los productos del inventario"
          href="/references/product-units"
          icon={Ruler}
        />
      </ReferenceList>
    </PageBase>
  )
}
