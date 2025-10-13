'use client'

import { useState } from 'react'
import { Search, Filter, Grid, List, Table } from 'lucide-react'
import useCustomerList from '@/hooks/customers/use-customer-list'
import { CustomerFilters } from '@/schemas/customers.schema'
import { CustomerList } from '@/components/customers/customer-list'
import { CustomerCreateButton } from '@/components/customers/customer-create-button'
import PageBase from '@/components/page-base'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Tables } from '@/types/supabase.types'

type Customer = Tables<'customers'>
type ViewMode = 'table' | 'card' | 'list'

export default function CustomersPage() {
  const [filters, setFilters] = useState<CustomerFilters>({})
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const { data: customers = [], isLoading } = useCustomerList({ filters })

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({
      ...prev,
      search: search || undefined,
    }))
  }

  const handleStatusChange = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      is_active: status === 'all' ? undefined : status === 'active',
    }))
  }

  const clearFilters = () => {
    setFilters({})
  }

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined
  )

  // La tabla clients no tiene campo is_active según supabase.types.ts
  const activeCustomersCount = customers.length
  const inactiveCustomersCount = 0

  return (
    <PageBase
      title="Clientes"
      subtitle={`Gestiona la información de tus clientes (${customers.length} registrados)`}
    >
      {/* Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, apellido o email..."
              value={filters.search || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={
              filters.is_active === undefined
                ? 'all'
                : filters.is_active
                  ? 'active'
                  : 'inactive'
            }
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="inactive">Inactivos</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                {viewMode === 'table' && <Table className="h-4 w-4" />}
                {viewMode === 'card' && <Grid className="h-4 w-4" />}
                {viewMode === 'list' && <List className="h-4 w-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setViewMode('table')}>
                <Table className="mr-2 h-4 w-4" />
                Tabla
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode('card')}>
                <Grid className="mr-2 h-4 w-4" />
                Tarjetas
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode('list')}>
                <List className="mr-2 h-4 w-4" />
                Lista
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters}>
              <Filter className="mr-2 h-4 w-4" />
              Limpiar
            </Button>
          )}

          <CustomerCreateButton />
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Clientes
              </p>
              <p className="text-2xl font-bold">{customers.length}</p>
            </div>
            <Badge variant="outline">{customers.length}</Badge>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Clientes Activos
              </p>
              <p className="text-2xl font-bold text-green-600">
                {activeCustomersCount}
              </p>
            </div>
            <Badge variant="default">{activeCustomersCount}</Badge>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Clientes Inactivos
              </p>
              <p className="text-2xl font-bold text-orange-600">
                {inactiveCustomersCount}
              </p>
            </div>
            <Badge variant="secondary">{inactiveCustomersCount}</Badge>
          </div>
        </div>
      </div>

      {/* Lista de Clientes */}
      <CustomerList
        customers={customers}
        isLoading={isLoading}
        onCustomerSelect={setSelectedCustomer}
        view={viewMode}
      />
    </PageBase>
  )
}