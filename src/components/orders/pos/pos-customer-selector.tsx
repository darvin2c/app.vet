'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { SearchInput } from '@/components/ui/search-input'
import { User, Plus } from 'lucide-react'
import { usePOSStore } from '@/hooks/pos/use-pos-store'
import useCustomerList from '@/hooks/customers/use-customer-list'
import { CustomerCreateButton } from '@/components/customers/customer-create-button'
import { Item, ItemGroup, ItemContent, ItemTitle, ItemDescription, ItemActions } from '@/components/ui/item'
import { Tables } from '@/types/supabase.types'

export function POSCustomerSelector() {
  const [open, setOpen] = useState(false)
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

  const handleCustomerCreated = (customer: Tables<'customers'>) => {
    setSelectedCustomer(customer)
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="justify-start gap-2 h-10">
          <User className="h-4 w-4" />
          {selectedCustomer 
            ? `${selectedCustomer.first_name} ${selectedCustomer.last_name}`
            : 'Seleccionar Cliente'
          }
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Seleccionar Cliente</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col gap-4 mt-6">
          <SearchInput
            placeholder="Buscar cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          
          <CustomerCreateButton
            onSuccess={handleCustomerCreated}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Cliente
          </CustomerCreateButton>
          
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
                    key={customer.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSelectCustomer(customer)}
                  >
                    <ItemContent>
                      <ItemTitle>{customer.first_name} {customer.last_name}</ItemTitle>
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
    </Sheet>
  )
}
