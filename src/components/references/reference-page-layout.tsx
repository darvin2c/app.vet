import { ReactNode } from 'react'
import PageBase from '@/components/page-base'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { LucideIcon } from 'lucide-react'

interface ReferencePageLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  icon?: LucideIcon
  search?: React.ReactNode
}

export function ReferencePageLayout({
  children,
  title,
  subtitle,
  icon: Icon,
  search,
}: ReferencePageLayoutProps) {
  const titleWithIcon = Icon ? (
    <div className="flex items-center gap-2">
      <Icon className="h-6 w-6" />
      {title}
    </div>
  ) : (
    title
  )

  return (
    <PageBase title={titleWithIcon} subtitle={subtitle} search={search}>
      <div className="mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/references">Referencias</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {children}
    </PageBase>
  )
}
