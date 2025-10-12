'use client'

import { useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ClientActions } from './client-actions'
import { Tables } from '@/types/supabase.types'
import { ArrowUpDown, Phone, Mail, MapPin } from 'lucide-react'

type Client = Tables<'clients'>

interface ClientListProps {
  clients: Client[]
  isLoading?: boolean
  onClientSelect?: (client: Client) => void
  view?: 'table' | 'card' | 'list'
}

export function ClientList({ 
  clients, 
  isLoading = false, 
  onClientSelect,
  view = 'table' 
}: ClientListProps) {
  const columns = useMemo<ColumnDef<Client>[]>(
    () => [
      {
        accessorKey: 'full_name',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Cliente
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const client = row.original
          const initials = client.full_name.split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2)
          
          return (
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">
                  {client.full_name}
                </div>
                {client.email && (
                  <div className="text-sm text-muted-foreground">
                    {client.email}
                  </div>
                )}
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: 'phone',
        header: 'Teléfono',
        cell: ({ row }) => {
          const phone = row.getValue('phone') as string
          return phone ? (
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{phone}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">-</span>
          )
        },
      },
      {
        accessorKey: 'address',
        header: 'Dirección',
        cell: ({ row }) => {
          const address = row.getValue('address') as string
          return address ? (
            <div className="flex items-center space-x-2 max-w-xs">
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="truncate">{address}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">-</span>
          )
        },
      },
      {
        accessorKey: 'is_active',
        header: 'Estado',
        cell: ({ row }) => {
          const isActive = row.getValue('is_active') as boolean
          return (
            <Badge variant={isActive ? 'default' : 'secondary'}>
              {isActive ? 'Activo' : 'Inactivo'}
            </Badge>
          )
        },
      },
      {
        accessorKey: 'created_at',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Fecha de Registro
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const date = row.getValue('created_at') as string
          return format(new Date(date), 'dd/MM/yyyy', { locale: es })
        },
      },
      {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => (
          <ClientActions 
            client={row.original} 
            onView={onClientSelect}
          />
        ),
      },
    ],
    [onClientSelect]
  )

  const table = useReactTable({
    data: clients,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  if (isLoading) {
    return <ClientListSkeleton view={view} />
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">
          No se encontraron clientes
        </div>
      </div>
    )
  }

  if (view === 'card') {
    return <ClientCardView clients={clients} onClientSelect={onClientSelect} />
  }

  if (view === 'list') {
    return <ClientListView clients={clients} onClientSelect={onClientSelect} />
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onClientSelect?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Mostrando {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} a{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            clients.length
          )}{' '}
          de {clients.length} clientes
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}

function ClientCardView({ 
  clients, 
  onClientSelect 
}: { 
  clients: Client[]
  onClientSelect?: (client: Client) => void 
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {clients.map((client) => {
        const initials = client.full_name.split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2)
        
        return (
          <Card 
            key={client.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onClientSelect?.(client)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">
                      {client.full_name}
                    </h3>
                    <Badge variant={client.is_active ? 'default' : 'secondary'} className="mt-1">
                      {client.is_active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                </div>
                <ClientActions client={client} onView={onClientSelect} />
              </div>
              
              <div className="mt-4 space-y-2">
                {client.email && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{client.email}</span>
                  </div>
                )}
                {client.phone && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{client.phone}</span>
                  </div>
                )}
                {client.address && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{client.address}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function ClientListView({ 
  clients, 
  onClientSelect 
}: { 
  clients: Client[]
  onClientSelect?: (client: Client) => void 
}) {
  return (
    <div className="space-y-2">
      {clients.map((client) => {
        const initials = client.full_name.split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2)
        
        return (
          <Card 
            key={client.id}
            className="cursor-pointer hover:shadow-sm transition-shadow"
            onClick={() => onClientSelect?.(client)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">
                      {client.full_name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      {client.email && (
                        <span className="flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span>{client.email}</span>
                        </span>
                      )}
                      {client.phone && (
                        <span className="flex items-center space-x-1">
                          <Phone className="h-3 w-3" />
                          <span>{client.phone}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={client.is_active ? 'default' : 'secondary'}>
                    {client.is_active ? 'Activo' : 'Inactivo'}
                  </Badge>
                  <ClientActions client={client} onView={onClientSelect} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function ClientListSkeleton({ view }: { view: 'table' | 'card' | 'list' }) {
  if (view === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-muted rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-24" />
                    <div className="h-3 bg-muted rounded w-16" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-32" />
                  <div className="h-3 bg-muted rounded w-28" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (view === 'list') {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse flex items-center space-x-3">
                <div className="h-10 w-10 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-32" />
                  <div className="h-3 bg-muted rounded w-48" />
                </div>
                <div className="h-6 bg-muted rounded w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha de Registro</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="animate-pulse flex items-center space-x-3">
                  <div className="h-8 w-8 bg-muted rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-24" />
                    <div className="h-3 bg-muted rounded w-32" />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="animate-pulse h-4 bg-muted rounded w-24" />
              </TableCell>
              <TableCell>
                <div className="animate-pulse h-4 bg-muted rounded w-32" />
              </TableCell>
              <TableCell>
                <div className="animate-pulse h-6 bg-muted rounded w-16" />
              </TableCell>
              <TableCell>
                <div className="animate-pulse h-4 bg-muted rounded w-20" />
              </TableCell>
              <TableCell>
                <div className="animate-pulse h-8 w-8 bg-muted rounded" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}