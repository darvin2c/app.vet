'use client'

import { useCallback, useEffect, useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import usePerms from '@/hooks/auth/use-perms'

interface PermissionsTreeProps {
  value: string[]
  onChange: (permissions: string[]) => void
  className?: string
}

export function PermissionsTree({
  value = [],
  onChange,
  className,
}: PermissionsTreeProps) {
  const { getTreePerms } = usePerms()
  const treeData = getTreePerms()

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [expandedResources, setExpandedResources] = useState<Set<string>>(
    new Set()
  )

  // Expandir todos los grupos por defecto
  useEffect(() => {
    const allGroups = new Set(treeData.map((group) => group.value))
    setExpandedGroups(allGroups)
  }, [treeData])

  const toggleGroup = useCallback((groupValue: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(groupValue)) {
        newSet.delete(groupValue)
      } else {
        newSet.add(groupValue)
      }
      return newSet
    })
  }, [])

  const toggleResource = useCallback((resourceValue: string) => {
    setExpandedResources((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(resourceValue)) {
        newSet.delete(resourceValue)
      } else {
        newSet.add(resourceValue)
      }
      return newSet
    })
  }, [])

  const handlePermissionChange = useCallback(
    (permValue: string, checked: boolean) => {
      const newPermissions = checked
        ? [...value, permValue]
        : value.filter((p) => p !== permValue)

      onChange(newPermissions)
    },
    [value, onChange]
  )

  const handleResourceToggle = useCallback(
    (resourceValue: string, checked: boolean) => {
      const group = treeData.find((g) =>
        g.resources.some((r) => r.value === resourceValue)
      )
      const resource = group?.resources.find((r) => r.value === resourceValue)

      if (!resource) return

      const resourcePerms = resource.perms.map((p) => p.value)

      const newPermissions = checked
        ? [...new Set([...value, ...resourcePerms])]
        : value.filter((p) => !resourcePerms.includes(p))

      onChange(newPermissions)
    },
    [value, onChange, treeData]
  )

  const handleGroupToggle = useCallback(
    (groupValue: string, checked: boolean) => {
      const group = treeData.find((g) => g.value === groupValue)
      if (!group) return

      const groupPerms = group.resources.flatMap((r) =>
        r.perms.map((p) => p.value)
      )

      const newPermissions = checked
        ? [...new Set([...value, ...groupPerms])]
        : value.filter((p) => !groupPerms.includes(p))

      onChange(newPermissions)
    },
    [value, onChange, treeData]
  )

  const isResourceChecked = useCallback(
    (resourceValue: string) => {
      const group = treeData.find((g) =>
        g.resources.some((r) => r.value === resourceValue)
      )
      const resource = group?.resources.find((r) => r.value === resourceValue)

      if (!resource) return false

      const resourcePerms = resource.perms.map((p) => p.value)
      return resourcePerms.every((p) => value.includes(p))
    },
    [value, treeData]
  )

  const isResourceIndeterminate = useCallback(
    (resourceValue: string) => {
      const group = treeData.find((g) =>
        g.resources.some((r) => r.value === resourceValue)
      )
      const resource = group?.resources.find((r) => r.value === resourceValue)

      if (!resource) return false

      const resourcePerms = resource.perms.map((p) => p.value)
      const checkedPerms = resourcePerms.filter((p) => value.includes(p))

      return (
        checkedPerms.length > 0 && checkedPerms.length < resourcePerms.length
      )
    },
    [value, treeData]
  )

  const isGroupChecked = useCallback(
    (groupValue: string) => {
      const group = treeData.find((g) => g.value === groupValue)
      if (!group) return false

      const groupPerms = group.resources.flatMap((r) =>
        r.perms.map((p) => p.value)
      )
      return groupPerms.every((p) => value.includes(p))
    },
    [value, treeData]
  )

  const isGroupIndeterminate = useCallback(
    (groupValue: string) => {
      const group = treeData.find((g) => g.value === groupValue)
      if (!group) return false

      const groupPerms = group.resources.flatMap((r) =>
        r.perms.map((p) => p.value)
      )
      const checkedPerms = groupPerms.filter((p) => value.includes(p))

      return checkedPerms.length > 0 && checkedPerms.length < groupPerms.length
    },
    [value, treeData]
  )

  return (
    <div className={cn('space-y-2', className)}>
      {treeData.map((group) => (
        <div key={group.value} className=" p-3">
          {/* Group Header */}
          <div className="flex items-center gap-2 mb-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => toggleGroup(group.value)}
            >
              {expandedGroups.has(group.value) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            <Checkbox
              checked={isGroupChecked(group.value)}
              onCheckedChange={(checked) =>
                handleGroupToggle(group.value, checked as boolean)
              }
              className={cn(
                isGroupIndeterminate(group.value) &&
                  'data-[state=checked]:bg-muted-foreground'
              )}
            />
            <Label
              className="font-medium cursor-pointer"
              onClick={() => toggleGroup(group.value)}
            >
              {group.label}
            </Label>
          </div>

          {/* Group Resources */}
          {expandedGroups.has(group.value) && (
            <div className="ml-8 space-y-2">
              {group.resources.map((resource) => (
                <div key={resource.value}>
                  {/* Resource Header with inline permissions */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={isResourceChecked(resource.value)}
                        onCheckedChange={(checked) =>
                          handleResourceToggle(resource.value, checked as boolean)
                        }
                        className={cn(
                          isResourceIndeterminate(resource.value) &&
                            'data-[state=checked]:bg-muted-foreground'
                        )}
                      />
                      <Label className="text-sm font-medium">
                        {resource.label}
                      </Label>
                    </div>
                    
                    {/* Inline Resource Permissions */}
                    <div className="flex flex-wrap gap-4">
                      {resource.perms.map((perm) => (
                        <div
                          key={perm.value}
                          className="flex items-center gap-2"
                        >
                          <Checkbox
                            checked={value.includes(perm.value)}
                            onCheckedChange={(checked) =>
                              handlePermissionChange(
                                perm.value,
                                checked as boolean
                              )
                            }
                          />
                          <Label className="text-sm text-muted-foreground">
                            {perm.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
