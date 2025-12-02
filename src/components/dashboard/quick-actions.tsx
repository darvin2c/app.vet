'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarPlus, UserPlus, ShoppingBag, FileBarChart } from 'lucide-react'

export function QuickActions() {
  return (
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
        >
          <CalendarPlus className="h-6 w-6 text-primary" />
          <span>Nueva Cita</span>
        </Button>
        <Button
          variant="outline"
          className="h-24 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5"
        >
          <UserPlus className="h-6 w-6 text-primary" />
          <span>Nuevo Paciente</span>
        </Button>
        <Button
          variant="outline"
          className="h-24 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5"
        >
          <ShoppingBag className="h-6 w-6 text-primary" />
          <span>Venta Mostrador</span>
        </Button>
        <Button
          variant="outline"
          className="h-24 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5"
        >
          <FileBarChart className="h-6 w-6 text-primary" />
          <span>Reporte Mensual</span>
        </Button>
      </CardContent>
    </Card>
  )
}
