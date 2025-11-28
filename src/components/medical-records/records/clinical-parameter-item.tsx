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
    <Item variant="muted" className="mb-2">
      <ItemContent>
        <div>
          {paramList.map((param) => {
            const paramInfo = getParam(param)
            const params =
              (clinicalParameter.params as Record<string, any>) || {}
            const value = params[param]

            return (
              <div key={param}>
                <span className="text-xs font-medium text-muted-foreground">
                  {(paramInfo as any)?.label || param}:
                </span>
                <Badge className="text-xs ml-1">
                  {String(value)} {(paramInfo as any)?.unit || ''}
                </Badge>
              </div>
            )
          })}
        </div>
      </ItemContent>
      <ItemActions>
        <ClinicalParameterActions clinicalParameter={clinicalParameter} />
      </ItemActions>
    </Item>
  )
}
