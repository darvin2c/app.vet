'use client'

import { useState } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer-form'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { TreatmentPlanItemAdd } from './treatment-plan-item-add'
import { TreatmentPlanItemEdit } from './treatment-plan-item-edit'
import { TreatmentPlanItemDelete } from './treatment-plan-item-delete'
import { useTreatmentPlanItemsList } from '@/hooks/treatment-plans/use-treatment-plan-items-list'
import { formatCurrency } from '@/lib/utils'
import {
  Plus,
  X,
  Eye,
  Edit,
  Trash2,
  FileText,
  AlertCircle,
  MoreHorizontal,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface TreatmentPlanItemsListProps {
  planId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TreatmentPlanItemsList({
  planId,
  open,
  onOpenChange,
}: TreatmentPlanItemsListProps) {
  const [showAddItem, setShowAddItem] = useState(false)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [deletingItem, setDeletingItem] = useState<string | null>(null)

  const {
    data: items = [],
    isLoading,
    error,
  } = useTreatmentPlanItemsList(planId)

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendiente', variant: 'secondary' as const },
      accepted: { label: 'Aceptado', variant: 'default' as const },
      rejected: { label: 'Rechazado', variant: 'destructive' as const },
      completed: { label: 'Completado', variant: 'success' as const },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      variant: 'secondary' as const,
    }

    return <Badge variant={config.variant as any}>{config.label}</Badge>
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <ItemGroup>
          {[...Array(3)].map((_, i) => (
            <Item key={i} variant="default">
              <ItemMedia variant="image">
                <Skeleton className="w-full h-full rounded-full" />
              </ItemMedia>
              <ItemContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </ItemContent>
              <ItemActions>
                <Skeleton className="h-8 w-8 rounded" />
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      )
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Error al cargar tratamientos
          </h3>
          <p className="text-muted-foreground mb-4">
            {error.message || 'Ocurrió un error inesperado'}
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </div>
      )
    }

    if (items.length === 0) {
      return (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No hay tratamientos</EmptyTitle>
            <EmptyDescription>
              Este plan no tiene tratamientos agregados aún.
            </EmptyDescription>
          </EmptyHeader>
          <Button onClick={() => setShowAddItem(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Primer Tratamiento
          </Button>
        </Empty>
      )
    }

    return (
      <ItemGroup>
        {items.map((item, index) => (
          <>
            <Item key={item.id} variant="default">
              <ItemMedia variant="image">
                <div className="flex items-center justify-center w-full h-full bg-muted rounded-full">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>
                  {item.procedures?.name || 'Procedimiento sin nombre'}
                </ItemTitle>
                <ItemDescription>
                  {item.procedures?.code || 'N/A'} •{' '}
                  {formatCurrency(item.total || 0)}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingItem(item.id)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDeletingItem(item.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </ItemActions>
            </Item>
            {index < items.length - 1 && <ItemSeparator />}
          </>
        ))}
      </ItemGroup>
    )
  }

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="!w-full !max-w-2xl">
          <DrawerHeader>
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle>Tratamientos del Plan</DrawerTitle>
                <DrawerDescription>
                  Gestiona los tratamientos incluidos en este plan
                </DrawerDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-6">{renderContent()}</div>

          <DrawerFooter>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {items.length} tratamiento{items.length !== 1 ? 's' : ''}
              </div>
              <ResponsiveButton
                onClick={() => setShowAddItem(true)}
                disabled={isLoading}
                icon={Plus}
              >
                Agregar Tratamiento
              </ResponsiveButton>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Drawer para agregar tratamiento */}
      <TreatmentPlanItemAdd
        treatmentPlanId={planId}
        open={showAddItem}
        onOpenChange={setShowAddItem}
        onSuccess={() => setShowAddItem(false)}
      />

      {/* Drawer para editar tratamiento */}
      {editingItem && (
        <TreatmentPlanItemEdit
          treatmentPlanItem={items.find((item) => item.id === editingItem)!}
          open={!!editingItem}
          onOpenChange={(open: boolean) => !open && setEditingItem(null)}
          onSuccess={() => setEditingItem(null)}
        />
      )}

      {/* Dialog para eliminar tratamiento */}
      {deletingItem && (
        <TreatmentPlanItemDelete
          item={items.find((item) => item.id === deletingItem)!}
          onSuccess={() => setDeletingItem(null)}
        />
      )}
    </>
  )
}
