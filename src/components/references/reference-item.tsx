import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from '@/components/ui/item'
import { LucideIcon } from 'lucide-react'

interface ReferenceItemProps {
  title: string
  description: string
  href: string
  icon: LucideIcon
  buttonText?: string
}

export function ReferenceItem({
  title,
  description,
  href,
  icon: Icon,
  buttonText = 'Ir al módulo',
}: ReferenceItemProps) {
  return (
    <Item variant="outline" className="hover:bg-muted/50 transition-colors">
      <ItemMedia variant="icon">
        <Icon className="text-primary" />
      </ItemMedia>

      <ItemContent>
        <ItemTitle>{title}</ItemTitle>
        <ItemDescription>{description}</ItemDescription>
      </ItemContent>

      <ItemActions>
        <Link href={href}>
          <Button
            variant="outline"
            size="sm"
            className="text-foreground border-border hover:bg-muted hover:text-foreground"
          >
            {buttonText}
          </Button>
        </Link>
      </ItemActions>
    </Item>
  )
}
