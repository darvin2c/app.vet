import Header from './header'

export default function PageBase({
  children,
  title,
  subtitle,
  search,
}: {
  children: React.ReactNode
  title?: React.ReactNode
  subtitle?: React.ReactNode
  search?: React.ReactNode
}) {
  return (
    <div className="@container mx-auto px-4 flex flex-col gap-4">
      <Header title={title} subtitle={subtitle} search={search} />
      {children}
    </div>
  )
}
