'use client'

import { forwardRef } from 'react'
import { LucideIcon } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { VariantProps } from 'class-variance-authority'
import * as React from 'react'

export interface ResponsiveButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  /**
   * El ícono a mostrar (componente de lucide-react)
   * Siempre se muestra
   */
  icon?: LucideIcon
  /**
   * Contenido adicional del botón
   * Se muestra junto al ícono en desktop
   */
  children?: React.ReactNode
  /**
   * Tooltip personalizado (opcional)
   */
  tooltip?: string
  /**
   * Si está en estado de carga
   */
  isLoading?: boolean
  /**
   * Si el botón debe adaptarse al dispositivo
   */
  isResponsive?: boolean
}

/**
 * ResponsiveButton - Componente genérico que se adapta al dispositivo
 *
 * Comportamiento:
 * - Desktop: Muestra ícono + children (si existe)
 * - Mobile: Solo ícono con tooltip (si existe)
 *
 * Modos de uso:
 * 1. Solo ícono: <ResponsiveButton icon={Icon} />
 * 2. Ícono + contenido: <ResponsiveButton icon={Icon}>Texto</ResponsiveButton>
 * 3. Con tooltip: <ResponsiveButton icon={Icon} tooltip="Descripción">Texto</ResponsiveButton>
 *
 * Puede usarse en cualquier contexto: headers, toolbars, cards, forms, etc.
 */
export const ResponsiveButton = forwardRef<
  HTMLButtonElement,
  ResponsiveButtonProps
>(
  (
    {
      icon: Icon,
      children,
      tooltip,
      isLoading = false,
      className,
      disabled,
      isResponsive = true,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const isDisabled = disabled || isLoading

    // Contenido del botón
    const buttonContent = () => {
      if (isLoading) {
        return (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )
      }

      return (
        <>
          {Icon && <Icon className="h-4 w-4" />}
          {!isMobile && !isResponsive && children}
        </>
      )
    }

    // En desktop, mostrar ícono + children (si existe)
    if (!isMobile) {
      return (
        <Button
          ref={ref}
          disabled={isDisabled}
          className={cn('gap-2', className)}
          {...props}
        >
          {buttonContent()}
        </Button>
      )
    }

    // En mobile, solo ícono con tooltip (si existe)
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              ref={ref}
              disabled={isDisabled}
              size="icon"
              className={className}
              {...props}
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                Icon && <Icon className="h-4 w-4" />
              )}
              <span className="sr-only">{tooltip || 'Botón'}</span>
            </Button>
          </TooltipTrigger>
          {tooltip && (
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    )
  }
)

ResponsiveButton.displayName = 'ResponsiveButton'
