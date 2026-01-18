'use client'
import { useMemo, useState } from 'react'
import { Check, ChevronsUpDown, Plus, X, Edit } from 'lucide-react'
import { cn } from '@/lib/utils'
import { InputGroup, InputGroupButton } from '@/components/ui/input-group'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Spinner } from '@/components/ui/spinner'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

export type ComboboxItem = {
  id: string
  title: string
  subtitle?: string
  avatarUrl?: string
  initials?: string
}

export interface EntitySelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  clearable?: boolean
  renderItem?: (item: ComboboxItem, selected: boolean) => React.ReactNode
  items?: ComboboxItem[]
  isPending?: boolean
  searchTerm?: string
  onSearchTermChange?: (term: string) => void
  renderCreate?: (params: {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: (id: string) => void
  }) => React.ReactNode
  renderEdit?: (params: {
    id?: string
    open: boolean
    onOpenChange: (open: boolean) => void
  }) => React.ReactNode
}

export function EntitySelect(props: EntitySelectProps) {
  const {
    value,
    onValueChange,
    placeholder = 'Seleccionar…',
    disabled = false,
    className,
    clearable = true,
    renderItem,
    items = [],
    isPending = false,
    searchTerm: propSearchTerm,
    onSearchTermChange,
    renderCreate,
    renderEdit,
  } = props

  const [open, setOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  // Internal state for search term if not controlled
  const [internalSearchTerm, setInternalSearchTerm] = useState('')

  const searchTerm = propSearchTerm ?? internalSearchTerm

  const selected = useMemo(
    () => items.find((i) => i.id === value),
    [items, value]
  )

  const handleSelect = (id: string) => {
    onValueChange?.(value === id ? '' : id)
    setOpen(false)
  }

  const handleSearchChange = (term: string) => {
    if (onSearchTermChange) {
      onSearchTermChange(term)
    } else {
      setInternalSearchTerm(term)
    }
  }

  const handleCreateSuccess = (id: string) => {
    onValueChange?.(id)
    setCreateOpen(false)
  }

  return (
    <>
      <InputGroup className={className}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <InputGroupButton
              variant="ghost"
              role="combobox"
              aria-expanded={open}
              className="flex-1 justify-between h-full px-3 py-2 text-left font-normal"
              disabled={disabled}
            >
              {selected ? (
                <div className="flex items-center gap-2">
                  <Avatar className="h-4 w-4">
                    <AvatarImage src={selected.avatarUrl || ''} />
                    <AvatarFallback className="text-xs">
                      {selected.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span>{selected.title}</span>
                    {selected.subtitle && (
                      <span className="text-sm text-muted-foreground">
                        {selected.subtitle}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </InputGroupButton>
          </PopoverTrigger>
          <PopoverContent
            className="w-[--radix-popover-trigger-width] p-0"
            align="start"
          >
            <Command>
              <CommandInput
                placeholder="Buscar…"
                value={searchTerm}
                onValueChange={handleSearchChange}
              />
              <CommandList>
                <CommandEmpty>
                  {isPending ? (
                    <div className="min-h-[100px]">
                      <Spinner />
                    </div>
                  ) : (
                    <Empty>
                      <EmptyHeader>
                        <EmptyMedia />
                        <EmptyTitle>Sin resultados</EmptyTitle>
                      </EmptyHeader>
                    </Empty>
                  )}
                </CommandEmpty>
                <CommandGroup className="max-h-64 overflow-auto">
                  {items.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={`${item.title} ${item.subtitle ?? ''}`.trim()}
                      onSelect={() => handleSelect(item.id)}
                    >
                      {renderItem ? (
                        renderItem(item, value === item.id)
                      ) : (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-4 w-4">
                            <AvatarImage src={item.avatarUrl || ''} />
                            <AvatarFallback className="text-xs">
                              {item.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span>{item.title}</span>
                            {item.subtitle && (
                              <span className="text-sm text-muted-foreground">
                                {item.subtitle}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      <Check
                        className={cn(
                          'h-4 w-4',
                          value === item.id ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {selected && clearable && (
          <InputGroupButton
            variant="ghost"
            onClick={() => onValueChange?.('')}
            disabled={disabled}
            aria-label="Limpiar selección"
            className="h-full"
          >
            <X className="h-4 w-4" />
          </InputGroupButton>
        )}

        <InputGroupButton
          variant="ghost"
          onClick={() => setCreateOpen(true)}
          disabled={disabled}
          aria-label="Crear nuevo recurso"
          className="h-full"
        >
          <Plus className="h-4 w-4" />
        </InputGroupButton>

        {selected && (
          <InputGroupButton
            variant="ghost"
            onClick={() => setEditOpen(true)}
            disabled={disabled}
            aria-label="Editar recurso seleccionado"
            className="h-full"
          >
            <Edit className="h-4 w-4" />
          </InputGroupButton>
        )}
      </InputGroup>

      {renderCreate?.({
        open: createOpen,
        onOpenChange: setCreateOpen,
        onSuccess: handleCreateSuccess,
      })}
      {renderEdit?.({
        id: selected?.id,
        open: editOpen,
        onOpenChange: setEditOpen,
      })}
    </>
  )
}
