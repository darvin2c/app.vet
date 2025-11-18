import type { Perm } from './types'
import { customersPerms } from './customers'
import { petsPerms } from './pets'
import { productsPerms } from './products'
import { servicesPerms } from './services'
import { ordersPerms } from './orders'
import { usersPerms } from './users'
import { rolesPerms } from './roles'
import { paymentsPerms } from './payments'
import { appointmentsPerms } from './appointments'

export const PERMS: Perm[] = [
  ...customersPerms,
  ...petsPerms,
  ...productsPerms,
  ...servicesPerms,
  ...paymentsPerms,
  ...appointmentsPerms,
  ...ordersPerms,
  ...usersPerms,
  ...rolesPerms,
]

export {
  customersPerms,
  petsPerms,
  productsPerms,
  servicesPerms,
  paymentsPerms,
  appointmentsPerms,
  ordersPerms,
  usersPerms,
  rolesPerms,
}
