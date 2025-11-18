export type Group = {
  value: string
  label: string
  description?: string
}

export type Resource = {
  value: string
  label: string
  description: string
  group: string
}

export type Perm = {
  value: string // 'resource:action'
  label: string
  description?: string
  can: boolean
}

export type TreeGroup = Group & {
  resources: (Resource & {
    perms: Perm[]
  })[]
}
