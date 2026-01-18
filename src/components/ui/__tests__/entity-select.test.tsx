// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EntitySelect, type ComboboxItem } from '@/components/ui/entity-select'
import { useState } from 'react'

const items: ComboboxItem[] = [
  { id: '1', title: 'Ana', subtitle: 'ana@x.com', initials: 'A' },
  { id: '2', title: 'Juan', subtitle: 'juan@x.com', initials: 'J' },
]

describe('EntitySelect — Controlled Mode', () => {
  it('permite buscar y seleccionar items controlados externamente', async () => {
    const user = userEvent.setup()

    function TestComponent() {
      const [search, setSearch] = useState('')
      const filteredItems = items.filter((i) =>
        i.title.toLowerCase().includes(search.toLowerCase())
      )

      return (
        <EntitySelect
          items={filteredItems}
          searchTerm={search}
          onSearchTermChange={setSearch}
        />
      )
    }

    render(<TestComponent />)
    await user.click(screen.getByRole('combobox'))

    // Buscar 'Ana'
    await user.type(screen.getByPlaceholderText(/buscar/i), 'Ana')

    // Verificar que solo aparece Ana
    expect(await screen.findByText('Ana')).toBeTruthy()
    expect(screen.queryByText('Juan')).toBeNull()
  })

  it('botón Crear abre renderCreate', async () => {
    const user = userEvent.setup()
    render(
      <EntitySelect
        items={items}
        renderCreate={({ open, onOpenChange }) =>
          open ? <div role="dialog">Crear</div> : null
        }
      />
    )
    await user.click(screen.getByLabelText('Crear nuevo recurso'))
    expect(screen.getByRole('dialog').textContent).toContain('Crear')
  })

  it('botón Editar abre renderEdit con id seleccionado', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [value, setValue] = useState('')
      return (
        <EntitySelect
          value={value}
          onValueChange={setValue}
          items={items}
          renderEdit={({ id, open }) =>
            open ? <div role="dialog">Editar {id}</div> : null
          }
        />
      )
    }
    render(<Controlled />)
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByText('Ana'))
    const editBtn = await screen.findByLabelText('Editar recurso seleccionado')
    await user.click(editBtn)
    expect(screen.getByRole('dialog').textContent).toContain('Editar 1')
  })
})
