'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Search, User, PawPrint, Plus, X, Phone, Mail } from 'lucide-react'
import { usePOSStore } from '@/hooks/pos/use-pos-store'
import useCustomerList from '@/hooks/customers/use-customer-list'
import { usePets } from '@/hooks/pets/use-pet-list'
import { useDebounce } from '@/hooks/use-debounce'
import { Tables } from '@/types/supabase.types'
import { CustomerCreate } from '@/components/customers/customer-create'

type Customer = Tables<'customers'>
type Pet = Tables<'pets'> & {
  customers: Tables<'customers'> | null
  breeds: Tables<'breeds'> | null
  species: Tables<'species'> | null
}

export function POSCustomerSelector() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showCustomers, setShowCustomers] = useState(false)
  const [showPets, setShowPets] = useState(false)
  const [showCreateCustomer, setShowCreateCustomer] = useState(false)

  const debouncedSearch = useDebounce(searchTerm, 300)

  const { selectedCustomer, selectedPet, setSelectedCustomer, setSelectedPet } = usePOSStore()

  // Fetch customers with search
  const { data: customers = [], isLoading: isLoadingCustomers } = useCustomerList({
    search: debouncedSearch,
    filters: [],
    orders: [{ field: 'first_name', ascending: true, direction: 'asc' }],
  })
  
  // Fetch pets for selected customer
  const { data: pets = [], isLoading: isLoadingPets } = usePets({
    filters: selectedCustomer?.id ? [{ field: 'client_id', value: selectedCustomer.id, operator: 'eq' }] : [],
  })

  // Auto-hide dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowCustomers(false)
      setShowPets(false)
    }

    if (showCustomers || showPets) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showCustomers, showPets])

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer)
    setSelectedPet(null) // Reset pet when customer changes
    setShowCustomers(false)
    setSearchTerm('')
  }

  const handlePetSelect = (pet: Pet) => {
    setSelectedPet(pet)
    setShowPets(false)
  }

  const clearCustomer = () => {
    setSelectedCustomer(null)
    setSelectedPet(null)
  }

  const clearPet = () => {
    setSelectedPet(null)
  }

  return (
    <div className="space-y-3">
      {/* Customer Selection */}
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            {selectedCustomer ? (
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">
                      {selectedCustomer.first_name} {selectedCustomer.last_name}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-blue-700">
                      {selectedCustomer.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {selectedCustomer.phone}
                        </span>
                      )}
                      {selectedCustomer.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {selectedCustomer.email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCustomer}
                  className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="relative">
                <Input
                  placeholder="Buscar cliente por nombre, teléfono o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowCustomers(true)}
                  className="pl-10 min-h-[44px]"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Customer Dropdown */}
        {showCustomers && !selectedCustomer && (
          <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-64 overflow-hidden">
            <ScrollArea className="max-h-64">
              {isLoadingCustomers ? (
                <div className="p-4 text-center text-gray-500">
                  Buscando clientes...
                </div>
              ) : customers.length > 0 ? (
                <div className="p-2">
                  {customers.map((customer) => (
                    <button
                      key={customer.id}
                      onClick={() => handleCustomerSelect(customer)}
                      className="w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-medium">{customer.first_name} {customer.last_name}</p>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            {customer.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {customer.phone}
                              </span>
                            )}
                            {customer.email && (
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {customer.email}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  {debouncedSearch
                    ? 'No se encontraron clientes'
                    : 'Escribe para buscar clientes'}
                </div>
              )}
            </ScrollArea>
          </Card>
        )}
      </div>

      {/* Pet Selection */}
      {selectedCustomer && (
        <>
          <Separator />
          <div className="relative">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                {selectedPet ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <PawPrint className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">
                          {selectedPet.name}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-green-700">
                          {selectedPet.species && (
                            <Badge variant="outline" className="text-xs">
                              {selectedPet.species.name}
                            </Badge>
                          )}
                          {selectedPet.breeds && (
                            <span>{selectedPet.breeds.name}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearPet}
                      className="h-8 w-8 p-0 text-green-600 hover:text-green-800 hover:bg-green-100"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setShowPets(true)}
                    className="w-full justify-start min-h-[44px] text-gray-600"
                  >
                    <PawPrint className="h-4 w-4 mr-2" />
                    Seleccionar mascota (opcional)
                  </Button>
                )}
              </div>
            </div>

            {/* Pet Dropdown */}
            {showPets && !selectedPet && (
              <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-64 overflow-hidden">
                <ScrollArea className="max-h-64">
                  {isLoadingPets ? (
                    <div className="p-4 text-center text-gray-500">
                      Cargando mascotas...
                    </div>
                  ) : pets.length > 0 ? (
                    <div className="p-2">
                      {pets.map((pet) => (
                        <button
                          key={pet.id}
                          onClick={() => handlePetSelect(pet)}
                          className="w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <PawPrint className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="font-medium">{pet.name}</p>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                {pet.species && (
                                  <Badge variant="outline" className="text-xs">
                                    {pet.species.name}
                                  </Badge>
                                )}
                                {pet.breeds && <span>{pet.breeds.name}</span>}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      Este cliente no tiene mascotas registradas
                    </div>
                  )}
                </ScrollArea>
              </Card>
            )}
          </div>
        </>
      )}

      {/* Quick Actions */}
      <div className="flex gap-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 min-h-[40px]"
          onClick={() => setShowCreateCustomer(true)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Nuevo Cliente
        </Button>

        {selectedCustomer && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1 min-h-[40px]"
            onClick={() => {
              // TODO: Open pet creation modal
              console.log('Create new pet for customer:', selectedCustomer.id)
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Nueva Mascota
          </Button>
        )}
      </div>

      {/* Customer Create Modal */}
      <CustomerCreate 
        open={showCreateCustomer} 
        onOpenChange={setShowCreateCustomer}
        onCustomerCreated={(customer) => {
          handleCustomerSelect(customer)
          setShowCreateCustomer(false)
        }}
      />
    </div>
  )
}
