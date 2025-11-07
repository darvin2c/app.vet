'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { BreedForm } from './breed-form'
import { useBreedCreate } from '@/hooks/breeds/use-breed-create'
import { breedCreateSchema, type BreedCreate } from '@/schemas/breeds.schema'
import { ScrollArea } from '../ui/scroll-area'
import { Form } from '../ui/form'

interface BreedCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedSpeciesId?: string
}

export function BreedCreate({
  open,
  onOpenChange,
  selectedSpeciesId,
}: BreedCreateProps) {
  const createBreed = useBreedCreate()

  const form = useForm({
    resolver: zodResolver(breedCreateSchema),
    defaultValues: {
      name: '',
      description: '',
      species_id: selectedSpeciesId || '',
      is_active: true,
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    await createBreed.mutateAsync(data)
    form.reset()
    onOpenChange(false)
  })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="max-w-2xl">
        <ScrollArea>
          <SheetHeader>
            <SheetTitle>Nueva Raza</SheetTitle>
            <SheetDescription>
              Crea una nueva raza en el sistema
            </SheetDescription>
          </SheetHeader>

          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="flex-1 overflow-y-auto px-4">
                <BreedForm selectedSpeciesId={selectedSpeciesId} />
              </div>

              <SheetFooter className="flex-row">
                <ResponsiveButton
                  type="submit"
                  icon={Plus}
                  isLoading={createBreed.isPending}
                  disabled={createBreed.isPending}
                  onClick={onSubmit}
                >
                  {createBreed.isPending ? 'Creando...' : 'Crear Raza'}
                </ResponsiveButton>
                <ResponsiveButton
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={createBreed.isPending}
                >
                  Cancelar
                </ResponsiveButton>
              </SheetFooter>
            </form>
          </Form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
