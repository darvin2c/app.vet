'use client'
import { useState } from 'react'
import { EntitySelect, type ComboboxItem } from '@/components/ui/entity-select'
import { usePagination } from '@/components/ui/pagination/use-pagination'
import { useQuery } from '@tanstack/react-query'

function MockCreate({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  if (!open) return null
  return (
    <div role="dialog" className="p-4">
      <div className="mb-2">Crear entidad</div>
      <button className="btn" onClick={() => onOpenChange(false)}>
        Cerrar
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
    <div className="p-6">
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
  )
}
