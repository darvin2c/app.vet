'use client'
import { useState } from 'react'
import { EntitySelect, type ComboboxItem } from '@/components/ui/entity-select'
import { usePagination } from '@/components/ui/pagination/use-pagination'
import { useQuery } from '@tanstack/react-query'

function MockCreate({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  onSuccess: (id: string) => void
}) {
  if (!open) return null
  return (
    <div role="dialog" className="p-4">
      <div className="mb-2">Crear entidad</div>
      <button
        className="btn"
        onClick={() => {
          // Simulamos creación exitosa de un ID '3'
          onSuccess('3')
        }}
      >
        Crear y Cerrar
      </button>
      <button className="btn ml-2" onClick={() => onOpenChange(false)}>
        Cancelar
      </button>
    </div>
  )
}

function MockEdit({
  id,
  open,
  onOpenChange,
}: {
  id?: string
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  if (!open) return null
  return (
    <div role="dialog" className="p-4">
      <div className="mb-2">Editar entidad {id}</div>
      <button className="btn" onClick={() => onOpenChange(false)}>
        Cerrar
      </button>
    </div>
  )
}

export default function DemoEntitySelectPage() {
  const [value, setValue] = useState('')
  const [multiValue, setMultiValue] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const { appliedPagination } = usePagination()
  const { data, isPending } = useQuery({
    queryKey: ['demo-entity-select', search, appliedPagination],
    queryFn: async () => {
      const base: ComboboxItem[] = [
        {
          id: '1',
          title: 'Ana Pérez',
          subtitle: 'ana@correo.com',
          initials: 'AP',
        },
        {
          id: '2',
          title: 'Juan Díaz',
          subtitle: 'juan@correo.com',
          initials: 'JD',
        },
      ]
      const items = base.filter((i) =>
        (i.title + ' ' + (i.subtitle ?? ''))
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      return { items }
    },
  })

  return (
    <div className="p-6 grid gap-8">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">
          1. Uso Estándar (con búsqueda simulada)
        </h2>
        <EntitySelect
          value={value}
          onValueChange={setValue}
          items={data?.items ?? []}
          isPending={isPending}
          searchTerm={search}
          onSearchTermChange={setSearch}
          renderCreate={(p) => <MockCreate {...p} />}
          renderEdit={(p) => <MockEdit {...p} />}
          placeholder="Seleccionar entidad…"
        />
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">
          2. Estado Cargando (isPending)
        </h2>
        <EntitySelect
          isPending={true}
          items={[]}
          placeholder="Cargando datos…"
        />
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">
          3. Estado Recargando (isPending con datos)
        </h2>
        <EntitySelect
          isPending={true}
          items={[
            { id: '1', title: 'Dato Existente 1', initials: 'D1' },
            { id: '2', title: 'Dato Existente 2', initials: 'D2' },
          ]}
          placeholder="Recargando..."
          searchTerm="Buscando..."
          onSearchTermChange={() => {}}
        />
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">4. Estado Vacío (Empty)</h2>
        <EntitySelect
          items={[]}
          placeholder="No hay resultados"
          searchTerm="término inexistente"
          onSearchTermChange={() => {}}
        />
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">
          5. Personalización de selección (renderSelected)
        </h2>
        <EntitySelect
          items={[
            {
              id: '1',
              title: 'Producto A',
              subtitle: 'SKU-123',
              initials: 'PA',
            },
          ]}
          value="1"
          placeholder="Seleccionar..."
          renderSelected={(item) => (
            <div className="flex items-center gap-2 text-blue-600 font-bold">
              <span>★ {item.title}</span>
              <span className="text-xs font-normal text-gray-500">
                ({item.subtitle})
              </span>
            </div>
          )}
        />
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">
          6. Uso Genérico (Item personalizado)
        </h2>
        <EntitySelect<{ id: string; code: string; name: string }>
          items={[
            { id: '101', code: 'X-99', name: 'Reactor' },
            { id: '102', code: 'Y-00', name: 'Capacitor' },
          ]}
          value="101"
          placeholder="Seleccionar componente..."
          renderSelected={(item) => (
            <span className="font-mono text-xs">
              [{item.code}] {item.name}
            </span>
          )}
          renderItem={(item) => (
            <div className="flex flex-col">
              <span className="font-bold">{item.name}</span>
              <span className="text-xs text-muted-foreground font-mono">
                {item.code}
              </span>
            </div>
          )}
        />
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">7. Selección Múltiple</h2>
        <EntitySelect
          multiple
          items={[
            { id: '1', title: 'Opción 1', initials: 'O1' },
            { id: '2', title: 'Opción 2', initials: 'O2' },
            { id: '3', title: 'Opción 3', initials: 'O3' },
          ]}
          value={multiValue}
          onValueChange={setMultiValue}
          placeholder="Seleccionar múltiples..."
        />
      </div>
    </div>
  )
}
