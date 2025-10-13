import { ItemGroup } from '@/components/ui/item'
import { cn } from '@/lib/utils'

interface ReferenceListProps {
  children: React.ReactNode
  className?: string
}

export function ReferenceList({ children, className }: ReferenceListProps) {
  return (
    <ItemGroup className={cn('space-y-2', className)}>{children}</ItemGroup>
  )
}
