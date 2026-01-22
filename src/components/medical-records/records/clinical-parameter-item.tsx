import { Badge } from '@/components/ui/badge'
import { Item, ItemActions, ItemContent } from '@/components/ui/item'
import useClinicalParameterParms from '@/hooks/clinical-parameters/use-clinical-parameter-parms'
import { Tables } from '@/types/supabase.types'
import { ClinicalParameterActions } from '@/components/clinical-parameters/clinical-parameter-actions'

type ClinicalParameter = Tables<'clinical_parameters'>

export default function ClinicalParameterItem({
  clinicalParameter,
}: {
  clinicalParameter: ClinicalParameter
}) {
  const { getParam } = useClinicalParameterParms()
  const paramList = Object.keys(clinicalParameter.params || {})

  return (
    <Item variant="muted" size="sm" className="mb-2">
      <ItemContent>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
          {paramList.map((param) => {
            const paramInfo = getParam(param)
            const params =
              (clinicalParameter.params as Record<string, any>) || {}
            const value = params[param]

            return (
              <div
                key={param}
                className="flex flex-row items-baseline justify-between sm:justify-start sm:gap-2"
              >
                <dt className="text-xs font-medium text-muted-foreground">
                  {(paramInfo as any)?.label || param}:
                </dt>
                <dd className="text-sm font-medium">
                  {String(value)} {(paramInfo as any)?.unit || ''}
                </dd>
              </div>
            )
          })}
        </dl>
      </ItemContent>
      <ItemActions>
        <ClinicalParameterActions clinicalParameter={clinicalParameter} />
      </ItemActions>
    </Item>
  )
}
