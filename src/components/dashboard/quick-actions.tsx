'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarPlus, UserPlus, ShoppingBag, PawPrint } from 'lucide-react'
import { AppointmentCreate } from '@/components/appointments/appointment-create'
import { PetCreate } from '@/components/pets/pet-create'
import { OrderPosCreate } from '@/components/orders/order-pos-create'
import { CustomerCreate } from '@/components/customers/customer-create'

export function QuickActions() {
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false)
  const [isPetOpen, setIsPetOpen] = useState(false)
  const [isPosOpen, setIsPosOpen] = useState(false)
  const [isCustomerOpen, setIsCustomerOpen] = useState(false)

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">
            Acciones Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5"
            onClick={() => setIsAppointmentOpen(true)}
          >
            <CalendarPlus className="h-6 w-6 text-primary" />
            <span>Nueva Cita</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5"
            onClick={() => setIsCustomerOpen(true)}
          >
            <UserPlus className="h-6 w-6 text-primary" />
            <span>Nuevo Cliente</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5"
            onClick={() => setIsPetOpen(true)}
          >
            <PawPrint className="h-6 w-6 text-primary" />
            <span>Nuevo Paciente</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5"
            onClick={() => setIsPosOpen(true)}
          >
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span>Crea Orden</span>
          </Button>
        </CardContent>
      </Card>

      <AppointmentCreate
        open={isAppointmentOpen}
        onOpenChange={setIsAppointmentOpen}
      />

      <PetCreate open={isPetOpen} onOpenChange={setIsPetOpen} />

      <OrderPosCreate open={isPosOpen} onOpenChange={setIsPosOpen} />

      <CustomerCreate open={isCustomerOpen} onOpenChange={setIsCustomerOpen} />
    </>
  )
}
