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
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
import { Spinner } from './spinner'

interface FormSheetProps<T extends FieldValues> {
  open: boolean
  onOpenChange: (open: boolean) => void
  trigger?: React.ReactNode
  title: string
  description?: string
  form: UseFormReturn<T>
  onSubmit: (data: T) => void
  children: React.ReactNode
  isPending?: boolean
  submitLabel?: string
  cancelLabel?: string
  className?: string
  side?: 'top' | 'bottom' | 'left' | 'right'
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
  isPending = false,
  submitLabel = 'Guardar',
  cancelLabel = 'Cancelar',
  className,
  side = 'right',
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

        <SheetFooter
          className={cn(
            isMobile ? 'flex-row gap-2 px-4 pb-4' : 'flex-row justify-end gap-2'
          )}
        >
          {isMobile ? (
            <div className="flex w-full gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
                className="flex-1"
              >
                {cancelLabel}
              </Button>
              <Button type="submit" disabled={isPending} className="flex-1">
                {isPending ? 'Guardando...' : submitLabel}
              </Button>
            </div>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                {cancelLabel}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Guardando...' : submitLabel}
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
            ? 'max-h-[95vh] !max-w-full rounded-t-xl'
            : 'sm:!max-w-xl h-full',
          className
        )}
      >
        {FormContent}
      </SheetContent>
    </Sheet>
  )
}
