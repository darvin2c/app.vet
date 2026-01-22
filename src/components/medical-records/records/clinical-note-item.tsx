import { Item, ItemContent, ItemTitle, ItemActions } from '@/components/ui/item'
import { Tables } from '@/types/supabase.types'
import { FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ClinicalNoteActions } from '@/components/clinical-notes/clinical-note-actions'

export default function ClinicalNoteItem({
  clinicalNote,
}: {
  clinicalNote: Tables<'clinical_notes'>
}) {
  return (
    <Item key={clinicalNote.id} variant="muted" size="sm">
      <ItemContent>
        <ItemTitle className="text-sm flex items-center gap-2">
          <FileText className="h-3 w-3 text-blue-500" />
          <span>Nota Clínica</span>
          <Badge variant="outline" className="text-xs">
            {format(new Date(clinicalNote.created_at), 'dd/MM/yyyy HH:mm', {
              locale: es,
            })}
          </Badge>
        </ItemTitle>
        <div className="mt-2 flex flex-col sm:flex-row sm:gap-2 items-start sm:items-baseline">
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
            Nota:
          </span>
          <p className="text-sm whitespace-pre-wrap">{clinicalNote.note}</p>
        </div>
      </ItemContent>
      <ItemActions>
        <ClinicalNoteActions clinicalNote={clinicalNote} />
      </ItemActions>
    </Item>
  )
}
