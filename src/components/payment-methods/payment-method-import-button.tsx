'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'
import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { PaymentMethodImport } from './payment-method-import'

export function PaymentMethodImportButton({
  children,
  ...props
}: ResponsiveButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton
        icon={Upload}
        tooltip="Importar Métodos de Pago"
        onClick={() => setOpen(true)}
        variant="outline"
        {...props}
      >
        {children || 'Importar'}
      </ResponsiveButton>

      <PaymentMethodImport open={open} onOpenChange={setOpen} />
    </>
  )
}