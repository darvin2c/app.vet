'use client'

import { cn } from '@/lib/utils'
import {
  Item,
  ItemGroup,
  ItemMedia,
  ItemContent,
  ItemTitle,
} from '@/components/ui/item'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible'
import { ChevronDown } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import { useState } from 'react'
import useAppointmentStatus from '@/hooks/appointments/use-appointment-status'

interface AppointmentStatusGridProps {
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  className?: string
}

export function AppointmentStatusGrid({
  value,
  onValueChange,
  disabled = false,
  className,
}: AppointmentStatusGridProps) {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(true)
  const { statusList, getStatus } = useAppointmentStatus()

  // Encontrar el estado seleccionado
  const selectedStatus = statusList.find((status) => status.value === value)

  const handleSelection = (statusValue: string) => {
    if (disabled) return
    onValueChange?.(statusValue)
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn('w-full', className)}
    >
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-3">
            {selectedStatus && (
              <div
                className="w-3 h-3 rounded-full border"
                style={{ backgroundColor: selectedStatus.color }}
              />
            )}
            <span className="font-medium">
              {selectedStatus ? selectedStatus.label : 'Seleccionar estado'}
            </span>
          </div>
          <ChevronDown
            className={cn(
              'h-4 w-4 transition-transform',
              isOpen && 'rotate-180'
            )}
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <ItemGroup
          className={cn(
            'grid gap-2',
            isMobile ? 'grid-cols-2' : 'grid-cols-3 lg:grid-cols-4'
          )}
        >
          {statusList.map((status) => {
            const isSelected = value === status.value

            return (
              <Item
                key={status.value}
                variant={isSelected ? 'outline' : 'muted'}
                className={cn(
                  'cursor-pointer transition-all duration-200 hover:shadow-sm',
                  'border hover:border-primary/30 p-2',
                  'min-h-[60px] flex items-center justify-center text-center',
                  isSelected && 'border-primary bg-primary/5 shadow-sm',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
                onClick={() => handleSelection(status.value)}
              >
                <ItemContent className="flex flex-col items-center gap-1 w-full relative">
                  <ItemMedia
                    variant="icon"
                    className={cn(
                      'transition-colors w-6 h-6 rounded-full border flex items-center justify-center',
                      isSelected
                        ? 'border-primary'
                        : 'border-muted-foreground/30'
                    )}
                    style={{
                      backgroundColor: isSelected
                        ? status.color
                        : 'transparent',
                      borderColor: status.color,
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: isSelected ? 'white' : status.color,
                      }}
                    />
                  </ItemMedia>
                  <ItemTitle
                    className={cn(
                      'text-xs font-medium text-center leading-tight',
                      isSelected && 'text-primary'
                    )}
                  >
                    {status.label}
                  </ItemTitle>
                </ItemContent>
              </Item>
            )
          })}
        </ItemGroup>
      </CollapsibleContent>
    </Collapsible>
  )
}
