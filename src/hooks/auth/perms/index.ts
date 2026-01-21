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
import { productMovementsPerms } from './product-movements'
import { suppliersPerms } from './suppliers'
import { settingsPerms } from './settings'
import { appointmentTypesPerms } from './appointment-types'
import { paymentMethodsPerms } from './payment-methods'
import { productBrandsPerms } from './product-brands'
import { productCategoriesPerms } from './product-categories'
import { productUnitsPerms } from './product-units'
import { specialtiesPerms } from './specialties'
import { speciesPerms } from './species'
import { staffPerms } from './staff'

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
  ...productMovementsPerms,
  ...suppliersPerms,
  ...settingsPerms,
  ...appointmentTypesPerms,
  ...paymentMethodsPerms,
  ...productBrandsPerms,
  ...productCategoriesPerms,
  ...productUnitsPerms,
  ...specialtiesPerms,
  ...speciesPerms,
  ...staffPerms,
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
  productMovementsPerms,
  suppliersPerms,
  settingsPerms,
  appointmentTypesPerms,
  paymentMethodsPerms,
  productBrandsPerms,
  productCategoriesPerms,
  productUnitsPerms,
  specialtiesPerms,
  speciesPerms,
  staffPerms,
}
