'use client'

import * as React from 'react'
import { UseFormReturn, FieldValues } from 'react-hook-form'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ScrollArea } from '@/components/ui/scroll-area'
import CanAccess from '@/components/ui/can-access'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'

interface FormSheetProps<T extends FieldValues> {
  open: boolean
  onOpenChange: (open: boolean) => void
  trigger?: React.ReactNode
  title: string
  description?: string
  form: UseFormReturn<T>
  onSubmit: (data: T) => void
  children: React.ReactNode
  isLoading?: boolean
  submitLabel?: string
  cancelLabel?: string
  className?: string
  side?: 'top' | 'bottom' | 'left' | 'right'
  resource?: string
  action?: string
}

export function FormSheet<T extends FieldValues>({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  form,
  onSubmit,
  children,
  isLoading = false,
  submitLabel = 'Guardar',
  cancelLabel = 'Cancelar',
  className,
  side = 'right',
  resource,
  action,
}: FormSheetProps<T>) {
  const isMobile = useIsMobile()

  const FormContent = (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full flex-col overflow-hidden"
      >
        <SheetHeader className={cn(isMobile ? 'text-left' : '')}>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="px-4 pb-4">{children}</div>
          </ScrollArea>
        </div>

        <SheetFooter className={cn(isMobile ? 'flex-row gap-2 px-4 pb-4' : '')}>
          {isMobile ? (
            <div className="flex w-full gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className="flex-1"
              >
                {cancelLabel}
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? 'Guardando...' : submitLabel}
              </Button>
            </div>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                {cancelLabel}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Guardando...' : submitLabel}
              </Button>
            </>
          )}
        </SheetFooter>
      </form>
    </Form>
  )

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent
        side={isMobile ? 'bottom' : side}
        className={cn(
          '!w-full p-0 gap-0',
          isMobile
            ? 'h-[90vh] !max-w-full rounded-t-xl'
            : 'sm:!max-w-xl h-full',
          className
        )}
      >
        {resource && action ? (
          <CanAccess resource={resource} action={action}>
            {FormContent}
          </CanAccess>
        ) : (
          FormContent
        )}
      </SheetContent>
    </Sheet>
  )
}
