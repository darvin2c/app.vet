'use client'
import { useMemo, useState } from 'react'
import { Check, ChevronsUpDown, Plus, X, Edit, SearchX } from 'lucide-react'
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
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useIsMobile } from '@/hooks/use-mobile'

export type ComboboxItem = {
  id: string
} & Record<string, unknown>

export interface EntitySelectProps<T extends ComboboxItem = ComboboxItem> {
  value?: string | string[]
  onValueChange?: (value: any) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  clearable?: boolean
  multiple?: boolean
  renderItem?: (item: T, selected: boolean) => React.ReactNode
  items?: T[]
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
  renderSelected?: (item: T) => React.ReactNode
}

export function EntitySelect<T extends ComboboxItem = ComboboxItem>(
  props: EntitySelectProps<T>
) {
  const {
    value,
    onValueChange,
    placeholder = 'Seleccionar…',
    disabled = false,
    className,
    clearable = true,
    multiple = false,
    renderItem,
    items = [],
    isPending = false,
    searchTerm: propSearchTerm,
    onSearchTermChange,
    renderCreate,
    renderEdit,
    renderSelected,
  } = props

  const [open, setOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  // Internal state for search term if not controlled
  const [internalSearchTerm, setInternalSearchTerm] = useState('')

  const isMobile = useIsMobile()
  const searchTerm = propSearchTerm ?? internalSearchTerm

  const selectedIds = useMemo(() => {
    if (multiple) {
      return Array.isArray(value) ? value : []
    }
    return typeof value === 'string' && value ? [value] : []
  }, [value, multiple])

  const selectedItems = useMemo(
    () => items.filter((i) => selectedIds.includes(i.id)),
    [items, selectedIds]
  )

  const selected = multiple ? null : selectedItems[0]

  const handleSelect = (id: string) => {
    if (multiple) {
      const current = selectedIds
      const next = current.includes(id)
        ? current.filter((i) => i !== id)
        : [...current, id]
      onValueChange?.(next)
    } else {
      onValueChange?.(selectedIds[0] === id ? '' : id)
      setOpen(false)
    }
  }

  const handleSearchChange = (term: string) => {
    if (onSearchTermChange) {
      onSearchTermChange(term)
    } else {
      setInternalSearchTerm(term)
    }
  }

  const handleCreateSuccess = (id: string) => {
    if (multiple) {
      onValueChange?.([...selectedIds, id])
    } else {
      onValueChange?.(id)
    }
    setCreateOpen(false)
  }

  const handleRemove = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (multiple) {
      onValueChange?.(selectedIds.filter((i) => i !== id))
    } else {
      onValueChange?.('')
    }
  }

  const trigger = (
    <InputGroupButton
      variant="ghost"
      role="combobox"
      aria-expanded={open}
      className="flex-1 justify-between h-full px-3 py-2 text-left font-normal"
      disabled={disabled}
    >
      {selectedItems.length > 0 ? (
        multiple ? (
          <div className="flex flex-wrap gap-1">
            {selectedItems.map((item) => (
              <div
                key={item.id}
                className="bg-secondary text-secondary-foreground flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium"
              >
                <span>
                  {String(item.title ?? item.name ?? item.label ?? item.id)}
                </span>
                <div
                  role="button"
                  tabIndex={0}
                  className="hover:bg-secondary-foreground/20 rounded-full p-0.5 cursor-pointer"
                  onClick={(e) => handleRemove(item.id, e)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleRemove(item.id)
                    }
                  }}
                >
                  <X className="h-3 w-3" />
                </div>
              </div>
            ))}
          </div>
        ) : renderSelected ? (
          renderSelected(selected!)
        ) : (
          <div className="flex items-center gap-2 min-w-0 text-left">
            <Avatar className="h-5 w-5 shrink-0">
              <AvatarImage src={String(selected!.avatarUrl || '')} />
              <AvatarFallback className="text-[10px]">
                {String(selected!.initials ?? '')}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 overflow-hidden">
              <span className="truncate text-sm font-medium leading-none">
                {String(
                  selected!.title ??
                    selected!.name ??
                    selected!.label ??
                    selected!.id
                )}
              </span>
              {typeof selected!.subtitle === 'string' && (
                <span className="truncate text-xs text-muted-foreground leading-none mt-0.5">
                  {selected!.subtitle}
                </span>
              )}
            </div>
          </div>
        )
      ) : (
        <span className="text-muted-foreground">{placeholder}</span>
      )}
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </InputGroupButton>
  )

  const content = (
    <Command>
      <div className="relative">
        <CommandInput
          placeholder="Buscar…"
          value={searchTerm}
          onValueChange={handleSearchChange}
        />
        {isPending && items.length > 0 && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <Spinner className="h-4 w-4" />
          </div>
        )}
      </div>
      <CommandList>
        <CommandEmpty>
          <Empty>
            <EmptyHeader>
              <EmptyMedia>
                <SearchX className="h-10 w-10 text-muted-foreground" />
              </EmptyMedia>
              <EmptyTitle>Sin resultados</EmptyTitle>
              <EmptyDescription>
                No se encontraron coincidencias para la búsqueda actual.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CommandEmpty>
        <CommandGroup className="max-h-64 overflow-auto">
          {items.map((item) => (
            <CommandItem
              key={item.id}
              value={`${item.title ?? item.name ?? item.label ?? item.id} ${item.subtitle ?? ''}`.trim()}
              onSelect={() => handleSelect(item.id)}
            >
              {renderItem ? (
                renderItem(item, selectedIds.includes(item.id))
              ) : (
                <div className="flex items-center gap-2">
                  <Avatar className="h-4 w-4">
                    <AvatarImage src={String(item.avatarUrl || '')} />
                    <AvatarFallback className="text-xs">
                      {String(item.initials ?? '')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span>
                      {String(item.title ?? item.name ?? item.label ?? item.id)}
                    </span>
                    {typeof item.subtitle === 'string' && (
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
                  selectedIds.includes(item.id) ? 'opacity-100' : 'opacity-0'
                )}
              />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )

  const actionButtons = (
    <>
      {selectedItems.length > 0 && clearable && (
        <InputGroupButton
          variant="ghost"
          onClick={() => onValueChange?.(multiple ? [] : '')}
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

      {!multiple && selected && (
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
    </>
  )

  if (isMobile) {
    return (
      <>
        <InputGroup className={className}>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>{trigger}</SheetTrigger>
            <SheetContent side="bottom">
              <SheetHeader>
                <SheetTitle>{placeholder}</SheetTitle>
              </SheetHeader>
              {content}
            </SheetContent>
          </Sheet>
          {actionButtons}
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

  return (
    <>
      <InputGroup className={className}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>{trigger}</PopoverTrigger>
          <PopoverContent
            className="w-[--radix-popover-trigger-width] p-0"
            align="start"
          >
            {content}
          </PopoverContent>
        </Popover>
        {actionButtons}
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
