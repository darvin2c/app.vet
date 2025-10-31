'use client'

import { useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import usePerms from '@/hooks/auth/use-perms'
import { cn } from '@/lib/utils'

interface PermissionsDisplayProps {
  perms: string[]
  maxItems?: number
  className?: string
}

export function PermissionsDisplay({ 
  perms, 
  maxItems = 3, 
  className 
}: PermissionsDisplayProps) {
  const { getTreePerms } = usePerms()
  
  const groupedPermissions = useMemo(() => {
    if (!perms || perms.length === 0) return []
    
    const treeData = getTreePerms()
    const grouped: { resource: string; actions: string[] }[] = []
    
    // Agrupar permisos por recurso
    perms.forEach(perm => {
      const [resourceValue, action] = perm.split(':')
      
      // Buscar el recurso en la estructura de árbol para obtener su label
      const resourceInfo = treeData
        .flatMap(group => group.resources)
        .find(resource => resource.value === resourceValue)
      
      if (resourceInfo) {
        // Buscar la acción para obtener su label
        const actionInfo = resourceInfo.perms.find(p => p.value === perm)
        
        if (actionInfo) {
          const existingGroup = grouped.find(g => g.resource === resourceInfo.label)
          
          if (existingGroup) {
            existingGroup.actions.push(actionInfo.label)
          } else {
            grouped.push({
              resource: resourceInfo.label,
              actions: [actionInfo.label]
            })
          }
        }
      }
    })
    
    return grouped
  }, [perms, getTreePerms])
  
  if (!perms || perms.length === 0) {
    return (
      <span className="text-muted-foreground text-sm">
        Sin permisos
      </span>
    )
  }
  
  const displayedGroups = groupedPermissions.slice(0, maxItems)
  const remainingCount = groupedPermissions.length - maxItems
  
  return (
    <div className={cn('flex flex-wrap gap-1', className)}>
      <Badge variant="secondary" className="text-xs">
        {perms.length} permisos
      </Badge>
      
      {displayedGroups.map((group, index) => (
        <Badge key={index} variant="outline" className="text-xs">
          {group.resource}: {group.actions.join(', ')}
        </Badge>
      ))}
      
      {remainingCount > 0 && (
        <Badge variant="outline" className="text-xs">
          +{remainingCount} más
        </Badge>
      )}
    </div>
  )
}