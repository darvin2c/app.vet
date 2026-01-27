'use client'

import React, { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { User, Plus, Search, X, ChevronLeft, PawPrint } from 'lucide-react'
import { usePOSStore } from '@/hooks/pos/use-pos-store'
import useCustomerList from '@/hooks/customers/use-customer-list'
import { usePetList } from '@/hooks/pets/use-pet-list'
import {
  Item,
  ItemGroup,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemSeparator,
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
  const [step, setStep] = useState<'customer' | 'pet'>('customer')

  const {
    customer: selectedCustomer,
    setCustomer,
    pet: selectedPet,
    setPet,
  } = usePOSStore()

  const { data, isLoading } = useCustomerList({
    search: step === 'customer' ? search : '',
    orders: [{ field: 'first_name', direction: 'asc' }],
  })
  const customers = data?.data || []

  const { data: petsData, isLoading: petsLoading } = usePetList({
    filters: selectedCustomer
      ? [{ field: 'customer_id', operator: 'eq', value: selectedCustomer.id }]
      : [],
    orders: [{ field: 'name', direction: 'asc' }],
    search: step === 'pet' ? search : '',
  })
  const pets = petsData?.data || []

  const handleSelectCustomer = (customer: Tables<'customers'>) => {
    setCustomer(customer)
    setStep('pet')
    setSearch('')
  }

  const handleSelectPet = (pet: Tables<'pets'>) => {
    setPet(pet)
    setOpen(false)
  }

  const handleBackToCustomer = () => {
    setStep('customer')
    setCustomer(null)
    setSearch('')
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen) {
      if (selectedCustomer && !selectedPet) {
        setStep('pet')
      } else if (!selectedCustomer) {
        setStep('customer')
      }
      // If both selected, maybe default to pet to allow changing it?
      // Or stay where we were? Let's default to customer if they want to change everything,
      // or maybe add a way to navigate.
      // For now:
      if (!selectedCustomer) {
        setStep('customer')
      } else {
        setStep('pet')
      }
      setSearch('')
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <InputGroup className="h-12">
        <InputGroupAddon>
          <User className="h-4 w-4" />
        </InputGroupAddon>
        <SheetTrigger asChild>
          <InputGroupButton
            variant="ghost"
            className="h-full px-3 min-w-[150px]"
          >
            {selectedCustomer ? (
              <div className="flex flex-col items-start text-left justify-center h-full gap-0.5">
                <span className="text-sm font-semibold leading-none">
                  {selectedCustomer.first_name} {selectedCustomer.last_name}
                </span>
                {selectedPet && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5 leading-none">
                    <PawPrint className="w-3 h-3" />
                    {selectedPet.name}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-muted-foreground">Seleccionar Cliente</span>
            )}
          </InputGroupButton>
        </SheetTrigger>
        {selectedCustomer && (
          <InputGroupButton
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              setCustomer(null)
              setStep('customer')
            }}
            aria-label="Limpiar selección"
            className="h-full"
          >
            <X className="h-8 w-8" />
          </InputGroupButton>
        )}
      </InputGroup>

      <SheetContent side="right" className="w-full !max-w-2xl">
        <SheetHeader>
          <div className="flex items-center gap-2">
            {step === 'pet' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBackToCustomer}
                className="mr-2"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            <SheetTitle>
              {step === 'customer'
                ? 'Seleccionar Cliente'
                : `Mascotas de ${selectedCustomer?.first_name}`}
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="px-4 flex flex-col gap-4 mt-4 h-full">
          <InputGroup className="h-10 shrink-0">
            <InputGroupAddon>
              <Search className="w-8 h-8" />
            </InputGroupAddon>
            <InputGroupInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                step === 'customer' ? 'Buscar cliente...' : 'Buscar mascota...'
              }
            />
            {step === 'customer' && (
              <InputGroupButton
                variant="ghost"
                onClick={() => setCreateOpen(true)}
                aria-label="Crear nuevo cliente"
                className="h-full"
              >
                <Plus className="h-8 w-8" />
                Nuevo Cliente
              </InputGroupButton>
            )}
          </InputGroup>

          <div className="flex-1 overflow-y-auto pb-8">
            {step === 'customer' ? (
              isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Cargando clientes...
                </div>
              ) : customers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No se encontraron clientes
                </div>
              ) : (
                <ItemGroup>
                  {customers.map((customer, index) => (
                    <React.Fragment key={customer.id}>
                      <Item
                        size="sm"
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
                          {customer?.id === selectedCustomer?.id && (
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          )}
                        </ItemActions>
                      </Item>
                      {index < customers.length - 1 && <ItemSeparator />}
                    </React.Fragment>
                  ))}
                </ItemGroup>
              )
            ) : (
              // Pet List
              <>
                {petsLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Cargando mascotas...
                  </div>
                ) : pets.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 gap-4">
                    <div className="text-muted-foreground">
                      Este cliente no tiene mascotas registradas
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPet(null)
                        setOpen(false)
                      }}
                    >
                      Continuar sin mascota
                    </Button>
                  </div>
                ) : (
                  <ItemGroup>
                    {pets.map((pet, index) => (
                      <React.Fragment key={pet.id}>
                        <Item
                          size="sm"
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSelectPet(pet)}
                        >
                          <ItemContent>
                            <ItemTitle>{pet.name}</ItemTitle>
                            <ItemDescription>
                              {[
                                // @ts-ignore
                                pet.species?.name,
                                // @ts-ignore
                                pet.breeds?.name,
                                pet.color,
                                pet.sex === 'M' ? 'Macho' : 'Hembra',
                              ]
                                .filter(Boolean)
                                .join(' • ')}
                            </ItemDescription>
                          </ItemContent>
                          <ItemActions>
                            {pet?.id === selectedPet?.id && (
                              <div className="w-2 h-2 bg-primary rounded-full" />
                            )}
                          </ItemActions>
                        </Item>
                        {index < pets.length - 1 && <ItemSeparator />}
                      </React.Fragment>
                    ))}
                    {/* Option to continue without pet if they have pets but don't want to select one */}
                    <ItemSeparator />
                    <Item
                      size="sm"
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => {
                        setPet(null)
                        setOpen(false)
                      }}
                    >
                      <ItemContent>
                        <ItemTitle className="text-muted-foreground">
                          Continuar sin mascota
                        </ItemTitle>
                      </ItemContent>
                    </Item>
                  </ItemGroup>
                )}
              </>
            )}
          </div>
        </div>
      </SheetContent>
      <CustomerCreate open={createOpen} onOpenChange={setCreateOpen} />
    </Sheet>
  )
}
