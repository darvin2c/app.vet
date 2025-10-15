import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PetInfoFieldProps {
  label: string
  value?: string | number | null
  children?: ReactNode
  className?: string
  placeholder?: string
}

export function PetInfoField({
  label,
  value,
  children,
  className,
  placeholder = 'No especificado',
}: PetInfoFieldProps) {
  return (
    <div className={cn('space-y-1', className)}>
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm">
        {children || (
          <span className={cn(value ? 'text-foreground' : 'text-muted-foreground')}>
            {value || placeholder}
          </span>
        )}
      </dd>
    </div>
  )
}