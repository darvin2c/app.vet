'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { User, Plus, Search, X } from 'lucide-react'
import { usePOSStore } from '@/hooks/pos/use-pos-store'
import useCustomerList from '@/hooks/customers/use-customer-list'
import {
  Item,
  ItemGroup,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from '@/components/ui/item'
import { Tables } from '@/types/supabase.types'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { CustomerCreate } from '@/components/customers/customer-create'

export function POSCustomerSelector() {
  const [open, setOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [search, setSearch] = useState('')

  const { selectedCustomer, setSelectedCustomer } = usePOSStore()

  const { data: customers = [], isLoading } = useCustomerList({
    search,
    filters: [],
    orders: [{ field: 'first_name', ascending: true, direction: 'asc' }],
  })

  const handleSelectCustomer = (customer: Tables<'customers'>) => {
    setSelectedCustomer(customer)
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <InputGroup className="h-12">
        <InputGroupAddon>
          <User className="h-4 w-4" />
        </InputGroupAddon>
        <SheetTrigger asChild>
          <InputGroupButton className="h-full">
            {selectedCustomer
              ? `${selectedCustomer.first_name} ${selectedCustomer.last_name}`
              : 'Seleccionar Cliente'}
          </InputGroupButton>
        </SheetTrigger>
        {selectedCustomer && (
          <InputGroupButton
            variant="ghost"
            onClick={() => setSelectedCustomer(null)}
            aria-label="Crear nuevo cliente"
            className="h-full"
          >
            <X className="h-8 w-8" />
          </InputGroupButton>
        )}
      </InputGroup>

      <SheetContent side="right" className="w-full !max-w-2xl">
        <SheetHeader>
          <SheetTitle>Seleccionar Cliente</SheetTitle>
        </SheetHeader>

        <div className="px-4 flex flex-col gap-4">
          <InputGroup className="h-10">
            <InputGroupAddon>
              <Search className="w-8 h-8" />
            </InputGroupAddon>
            <InputGroupInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <InputGroupButton
              variant="ghost"
              onClick={() => setCreateOpen(true)}
              aria-label="Crear nuevo cliente"
              className="h-full"
            >
              <Plus className="h-8 w-8" />
              Nuevo Cliente
            </InputGroupButton>
          </InputGroup>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Cargando clientes...
              </div>
            ) : customers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No se encontraron clientes
              </div>
            ) : (
              <ItemGroup>
                {customers.map((customer) => (
                  <Item
                    variant={'outline'}
                    key={customer.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSelectCustomer(customer)}
                  >
                    <ItemContent>
                      <ItemTitle>
                        {customer.first_name} {customer.last_name}
                      </ItemTitle>
                      <ItemDescription>
                        {customer.email || customer.phone || 'Sin contacto'}
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      {selectedCustomer?.id === customer.id && (
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      )}
                    </ItemActions>
                  </Item>
                ))}
              </ItemGroup>
            )}
          </div>
        </div>
      </SheetContent>
      <CustomerCreate open={createOpen} onOpenChange={setCreateOpen} />
    </Sheet>
  )
}
