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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button, buttonVariants } from '@/components/ui/button'
import { TriangleAlert } from 'lucide-react'
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
  extraActions?: React.ReactNode
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
  extraActions,
}: FormSheetProps<T>) {
  const isMobile = useIsMobile()
  const [showExitWarning, setShowExitWarning] = React.useState(false)
  const { isDirty } = form.formState

  React.useEffect(() => {
    if (!open || !isDirty) return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [open, isDirty])

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && isDirty) {
      setShowExitWarning(true)
    } else {
      onOpenChange(newOpen)
    }
  }

  const handleConfirmExit = () => {
    setShowExitWarning(false)
    form.reset() // Opcional: limpiar el formulario al salir forzosamente
    onOpenChange(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      // Si es Ctrl + Enter, enviar formulario
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        form.handleSubmit(onSubmit)()
        return
      }

      // Si es solo Enter, prevenir envío si no es un textarea
      const target = e.target as HTMLElement
      if (
        target.tagName !== 'TEXTAREA' &&
        target.getAttribute('role') !== 'button'
      ) {
        e.preventDefault()
      }
    }
  }

  const FormContent = (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.stopPropagation()
          form.handleSubmit(onSubmit)(e)
        }}
        onKeyDown={handleKeyDown}
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
            isMobile
              ? 'flex-col gap-2 px-4 pb-4'
              : 'flex-row justify-between gap-2'
          )}
        >
          {isMobile ? (
            <div className="flex flex-col gap-3 w-full">
              <div className="flex w-full gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  disabled={isPending}
                  className="flex-1"
                >
                  {cancelLabel}
                </Button>
                <Button type="submit" disabled={isPending} className="flex-1">
                  {isPending ? (
                    <>
                      <span className="sr-only">Guardando...</span>
                      <Spinner className="animate-spin h-4 w-4" />
                    </>
                  ) : (
                    submitLabel
                  )}
                </Button>
              </div>
              {extraActions && <div className="w-full">{extraActions}</div>}
            </div>
          ) : (
            <>
              <div className="flex-1 flex justify-start">{extraActions}</div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  disabled={isPending}
                >
                  {cancelLabel}
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Spinner />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    submitLabel
                  )}
                </Button>
              </div>
            </>
          )}
        </SheetFooter>
      </form>
    </Form>
  )

  return (
    <>
      <Sheet open={open} onOpenChange={handleOpenChange}>
        {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
        <SheetContent
          side={isMobile ? 'bottom' : side}
          className={cn(
            '!w-full p-0 gap-0',
            isMobile
              ? '[&_[data-radix-scroll-area-viewport]]:max-h-[calc(100vh-200px)] !max-w-full rounded-t-xl'
              : 'h-full',
            className
          )}
          onInteractOutside={(e) => {
            if (isDirty) {
              e.preventDefault()
              setShowExitWarning(true)
            }
          }}
        >
          {FormContent}
        </SheetContent>
      </Sheet>

      <AlertDialog open={showExitWarning} onOpenChange={setShowExitWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <TriangleAlert className="size-5" />
              ¿Estás seguro de que quieres salir?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tienes cambios sin guardar. Si sales ahora, perderás toda la
              información ingresada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmExit}
              className={buttonVariants({ variant: 'destructive' })}
            >
              Salir sin guardar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
