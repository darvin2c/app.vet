import { POSInterface } from '@/components/orders/pos/pos-interface'
import CanAccess from '@/components/ui/can-access'

export default function POSPage() {
  return (
    <CanAccess resource="pos" action="read">
      <POSInterface />
    </CanAccess>
  )
}
