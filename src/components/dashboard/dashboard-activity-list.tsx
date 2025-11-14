'use client'

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { Badge } from '@/components/ui/badge'

type Activity = {
  id: string
  title: string
  description: string
  date: string
  status?: 'success' | 'warning' | 'error'
}

export function DashboardActivityList({
  activities = [],
}: {
  activities?: Activity[]
}) {
  return (
    <ItemGroup className="space-y-2">
      {activities.map((a) => (
        <Item key={a.id} variant="outline">
          <ItemContent>
            <div className="flex items-center justify-between">
              <div>
                <ItemTitle>{a.title}</ItemTitle>
                <ItemDescription>{a.description}</ItemDescription>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">{a.date}</div>
                {a.status && (
                  <Badge
                    variant={
                      a.status === 'success'
                        ? 'default'
                        : a.status === 'warning'
                          ? 'secondary'
                          : 'destructive'
                    }
                    className="mt-1"
                  >
                    {a.status}
                  </Badge>
                )}
              </div>
            </div>
          </ItemContent>
          <ItemActions />
        </Item>
      ))}
      {activities.length === 0 && (
        <div className="text-sm text-muted-foreground">
          Sin actividad reciente
        </div>
      )}
    </ItemGroup>
  )
}
