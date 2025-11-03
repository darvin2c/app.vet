import { ItemGroup, Item, ItemMedia, ItemContent, ItemTitle, ItemDescription } from '@/components/ui/item'
import { cn } from '@/lib/utils'
import { navigationGroups } from './reference-navigation'
import Link from 'next/link'

interface ReferenceListProps {
  className?: string
}

export function ReferenceList({ className }: ReferenceListProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {navigationGroups.map((group, groupIndex) => (
        <div key={groupIndex}>
          <h3 className="text-lg font-semibold mb-4">{group.label}</h3>
          <ItemGroup className="space-y-2">
            {group.items.map((item, itemIndex) => (
              <Item key={itemIndex} asChild>
                <Link href={item.href}>
                  <ItemMedia variant="icon">
                    <item.icon />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{item.title}</ItemTitle>
                    <ItemDescription>{item.tooltip}</ItemDescription>
                  </ItemContent>
                </Link>
              </Item>
            ))}
          </ItemGroup>
        </div>
      ))}
    </div>
  )
}
