'use client'

import { useState, useCallback } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  HeaderGroup,
  Header,
  Row,
  Cell,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { OrderByTableHeader } from '@/components/ui/order-by'
import { useOrderBy } from '@/components/ui/order-by/use-order-by'
import { OrderByConfig } from '@/components/ui/order-by'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from '@/components/ui/empty'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import {
  ArrowUpRightIcon,
  ChevronLeft,
  ChevronRight,
  Users,
  Crown,
  Shield,
} from 'lucide-react'
import { useUserList, UserWithRole } from '@/hooks/users/use-user-list'
import { useFilters, FilterConfig } from '@/components/ui/filters'
import { useSearch } from '@/components/ui/search-input/use-search'
import { ViewModeToggle, ViewMode } from '@/components/ui/view-mode-toggle'
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
} from '@/components/ui/item'
import { UserActions } from './user-actions'
import { PermissionsDisplay } from '../roles/permissions-display'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { IsActiveDisplay } from '../ui/is-active-field'
import { Pagination, usePagination } from '../ui/pagination'

export function UserList({
  filterConfig,
  orderByConfig,
}: {
  filterConfig: FilterConfig[]
  orderByConfig: OrderByConfig
}) {
  // Estado para el modo de vista
  const [viewMode, setViewMode] = useState<ViewMode>('table')

  // Hooks para filtros, ordenamiento y búsqueda
  const { appliedFilters } = useFilters(filterConfig)
  const orderByHook = useOrderBy(orderByConfig)
  const { appliedSearch } = useSearch()
  const { appliedPagination, paginationProps } = usePagination()
  const { data, isPending, error } = useUserList({
    filters: appliedFilters,
    search: appliedSearch,
    orders: orderByHook.appliedSorts,
    pagination: appliedPagination,
  })

  const users = data?.data || []
  console.log('users', users)
  // Función para obtener las iniciales del usuario
  const getUserInitials = (user: UserWithRole) => {
    const firstName = user.first_name || ''
    const lastName = user.last_name || ''
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  // Función para obtener el nombre completo
  const getFullName = (user: UserWithRole) => {
    const firstName = user.first_name || ''
    const lastName = user.last_name || ''
    return `${firstName} ${lastName}`.trim() || 'Sin nombre'
  }

  const columns: ColumnDef<UserWithRole>[] = [
    {
      accessorKey: 'user',
      header: ({ header }) => (
        <OrderByTableHeader
          field="profiles.first_name"
          orderByHook={orderByHook}
        >
          Usuario
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<UserWithRole> }) => {
        const user = row.original
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar_url || ''} />
              <AvatarFallback className="text-xs">
                {getUserInitials(user)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium flex items-center gap-2">
                {getFullName(user)}
                {user.is_superuser && (
                  <Crown className="h-4 w-4 text-yellow-500" />
                )}
              </div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'phone',
      header: 'Teléfono',
      cell: ({ row }: { row: Row<UserWithRole> }) => (
        <div className="text-sm">{row.original.phone || '-'}</div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Rol',
      cell: ({ row }: { row: Row<UserWithRole> }) => {
        const role = row.original.role
        return (
          <Popover>
            <PopoverTrigger>
              {role ? (
                <Badge variant="secondary">{role.name}</Badge>
              ) : (
                <Badge variant="outline">Sin rol</Badge>
              )}
            </PopoverTrigger>
            <PopoverContent>
              <div className="font-medium flex items-center gap-2">
                {role?.name || 'Sin rol'}
              </div>
              <div className="text-sm text-muted-foreground">
                {role?.description || 'Sin descripción'}
              </div>
              <PermissionsDisplay perms={role?.perms || []} />
            </PopoverContent>
          </Popover>
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }: { row: Row<UserWithRole> }) => {
        const user = row.original
        return (
          <div className="flex items-center gap-2">
            <IsActiveDisplay value={!!user.is_active} />
          </div>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }: { row: Row<UserWithRole> }) => {
        const user = row.original
        return (
          <UserActions
            user={{
              ...user,
            }}
          />
        )
      },
    },
  ]

  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  // Función para renderizar el encabezado de la tabla
  const renderTableHeader = useCallback(
    (headerGroup: HeaderGroup<UserWithRole>) => (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map((header: Header<UserWithRole, unknown>) => (
          <TableHead key={header.id}>
            {header.isPlaceholder
              ? null
              : flexRender(header.column.columnDef.header, header.getContext())}
          </TableHead>
        ))}
      </TableRow>
    ),
    []
  )

  // Función para renderizar las filas de la tabla
  const renderTableRow = useCallback(
    (row: Row<UserWithRole>) => (
      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
        {row.getVisibleCells().map((cell: Cell<UserWithRole, unknown>) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ),
    []
  )

  // Función para renderizar vista de tarjetas
  const renderCardsView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user: UserWithRole) => (
        <Card key={user.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar_url || ''} />
                  <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium flex items-center gap-2">
                    {getFullName(user)}
                    {user.is_superuser && (
                      <Crown className="h-4 w-4 text-yellow-500" />
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Teléfono:</span>
                <span className="text-sm">{user.phone || '-'}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Rol:</span>
                {user.role ? (
                  <Badge variant="secondary">{user.role.name}</Badge>
                ) : (
                  <Badge variant="outline">Sin rol</Badge>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Estado:</span>
                <div className="flex items-center gap-2">
                  <Badge variant={user.is_active ? 'default' : 'secondary'}>
                    {user.is_active ? 'Activo' : 'Inactivo'}
                  </Badge>
                  {user.is_superuser && (
                    <Badge variant="outline" className="text-yellow-600">
                      Super Admin
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  // Función para renderizar vista de lista
  const renderListView = () => (
    <ItemGroup className="space-y-2">
      {users.map((user: UserWithRole) => (
        <Item key={user.id} variant="outline">
          <ItemContent>
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar_url || ''} />
                <AvatarFallback className="text-xs">
                  {getUserInitials(user)}
                </AvatarFallback>
              </Avatar>
              <div>
                <ItemTitle className="flex items-center gap-2">
                  {getFullName(user)}
                  {user.is_superuser && (
                    <Crown className="h-4 w-4 text-yellow-500" />
                  )}
                </ItemTitle>
                <ItemDescription>{user.email}</ItemDescription>
              </div>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground mt-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                {user.role?.name || 'Sin rol'}
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={user.is_active ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {user.is_active ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </div>
          </ItemContent>
          <ItemActions>
            <UserActions
              user={{
                ...user,
              }}
            />
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  )

  // Estados de carga y error
  if (isPending) {
    return <TableSkeleton variant={viewMode} />
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">
          Error al cargar usuarios: {error.message}
        </p>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="flex items-center justify-center text-muted-foreground h-[calc(100vh-100px)]">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Users className="h-16 w-16" />
            </EmptyMedia>
            <EmptyTitle>No hay usuarios</EmptyTitle>
            <EmptyDescription>
              No se encontraron usuarios que coincidan con los filtros
              aplicados.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <a href="/usuarios/invitar">Invitar Usuario</a>
              </Button>
            </div>
          </EmptyContent>
          <Button
            variant="link"
            asChild
            className="text-muted-foreground"
            size="sm"
          >
            <a href="#">
              Saber Más <ArrowUpRightIcon />
            </a>
          </Button>
        </Empty>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controles de vista */}
      <div className="flex justify-end">
        <ViewModeToggle onValueChange={setViewMode} resource="users" />
      </div>

      {/* Contenido según la vista seleccionada */}
      {viewMode === 'table' && (
        <>
          <div>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map(renderTableHeader)}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map(renderTableRow)
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No hay resultados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {viewMode === 'cards' && renderCardsView()}
      {viewMode === 'list' && renderListView()}
      <div>
        <Pagination {...paginationProps} totalItems={data.total} />
      </div>
    </div>
  )
}
