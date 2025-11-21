'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  Undo,
  Redo,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { toWhatsAppText, toHtmlEmail } from './rich-minimal-editor.parsers'

interface RichMinimalEditorProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  onParsedChange?: (formats: {
    whatsappText?: string
    html?: string
    htmlEmail?: string
    raw?: Record<string, unknown>
  }) => void
}

export function RichMinimalEditor({
  value = '',
  onChange,
  placeholder = 'Escribe algo...',
  disabled = false,
  className,
  onParsedChange,
}: RichMinimalEditorProps) {
  const [isMounted, setIsMounted] = useState(false)

  // Usar useRef para rastrear si el cambio viene del usuario o de props externas
  const isInternalUpdate = useRef(false)
  const onChangeRef = useRef(onChange)
  const onParsedChangeRef = useRef(onParsedChange)

  // Mantener la referencia actualizada sin causar re-renders
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    onParsedChangeRef.current = onParsedChange
  }, [onParsedChange])

  // Estabilizar la configuración de extensiones con useMemo
  const extensions = useMemo(
    () => [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'leading-relaxed min-h-[1.5em] mb-2',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc list-outside ml-6 space-y-1 mb-2',
          },
          keepMarks: false,
          keepAttributes: false,
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal list-outside ml-6 space-y-1 mb-2',
          },
          keepMarks: false,
          keepAttributes: false,
        },
        listItem: {
          HTMLAttributes: {
            class: 'leading-relaxed mb-1',
          },
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline cursor-pointer',
        },
      }),
    ],
    []
  )

  // Estabilizar handleUpdate para evitar recreaciones innecesarias
  const handleUpdate = useCallback(
    ({ editor }: { editor: any }) => {
      isInternalUpdate.current = true
      const html = editor.getHTML()
      onChangeRef.current?.(html)
      const formats = {
        whatsappText: toWhatsAppText(html),
        html,
        htmlEmail: toHtmlEmail(html),
        raw: editor.getJSON?.(),
      }
      onParsedChangeRef.current?.(formats)
      // Reset flag after a short delay to allow for external updates
      setTimeout(() => {
        isInternalUpdate.current = false
      }, 0)
    },
    [] // Sin dependencias para mantener la función estable
  )

  const editor = useEditor(
    {
      extensions,
      content: value,
      immediatelyRender: false,
      editable: !disabled,
      onUpdate: handleUpdate,
    },
    [extensions, disabled] // Removido handleUpdate de las dependencias
  )

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Mejorar la sincronización del contenido para evitar pérdida de foco
  useEffect(() => {
    if (
      editor &&
      value !== undefined &&
      value !== editor.getHTML() &&
      !isInternalUpdate.current && // Solo actualizar si no es un cambio interno
      !editor.isFocused // Solo actualizar si el editor no tiene foco
    ) {
      // Preservar la posición del cursor si es posible
      const { from, to } = editor.state.selection
      editor.commands.setContent(value) // Usar sin el parámetro false

      // Intentar restaurar la selección si es válida
      try {
        if (
          from <= editor.state.doc.content.size &&
          to <= editor.state.doc.content.size
        ) {
          editor.commands.setTextSelection({ from, to })
        }
      } catch (error) {
        // Si no se puede restaurar la selección, continuar sin error
        console.debug('Could not restore cursor position:', error)
      }
    }
  }, [editor, value])

  useEffect(() => {
    if (editor && isMounted) {
      const html = editor.getHTML()
      const formats = {
        whatsappText: toWhatsAppText(html),
        html,
        htmlEmail: toHtmlEmail(html),
        raw: editor.getJSON?.(),
      }
      onParsedChangeRef.current?.(formats)
    }
  }, [editor, isMounted])

  const setLink = useCallback(() => {
    if (!editor) return

    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  if (!isMounted || !editor) {
    return (
      <div className={cn('min-h-[120px] w-full', className)}>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    )
  }

  return (
    <div className={cn('relative w-full', className)}>
      {editor && (
        <BubbleMenu
          editor={editor}
          options={{
            placement: 'top',
            offset: 10,
          }}
          className="flex items-center gap-1 p-2 bg-white border border-gray-200 rounded-lg shadow-lg"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(
              'h-8 w-8 p-0',
              editor.isActive('bold') && 'bg-gray-100'
            )}
          >
            <Bold className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(
              'h-8 w-8 p-0',
              editor.isActive('italic') && 'bg-gray-100'
            )}
          >
            <Italic className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={cn(
              'h-8 w-8 p-0',
              editor.isActive('strike') && 'bg-gray-100'
            )}
          >
            <Underline className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-gray-200 mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn(
              'h-8 w-8 p-0',
              editor.isActive('bulletList') && 'bg-gray-100'
            )}
          >
            <List className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn(
              'h-8 w-8 p-0',
              editor.isActive('orderedList') && 'bg-gray-100'
            )}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={setLink}
            className={cn(
              'h-8 w-8 p-0',
              editor.isActive('link') && 'bg-gray-100'
            )}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-gray-200 mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="h-8 w-8 p-0"
          >
            <Undo className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="h-8 w-8 p-0"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </BubbleMenu>
      )}

      <EditorContent
        editor={editor}
        key="editor-content"
        className={cn(
          'prose prose-sm max-w-none focus-within:outline-none',
          'min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2',
          'text-sm ring-offset-background placeholder:text-muted-foreground',
          'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
          disabled && 'cursor-not-allowed opacity-50',
          '[&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[100px]',
          '[&_.ProseMirror]:leading-relaxed [&_.ProseMirror]:text-sm',
          '[&_.ProseMirror_p]:leading-relaxed [&_.ProseMirror_p]:min-h-[1.5em]',
          '[&_.ProseMirror_p]:mb-2 [&_.ProseMirror_p:last-child]:mb-0',
          '[&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:list-outside [&_.ProseMirror_ul]:ml-6',
          '[&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:list-outside [&_.ProseMirror_ol]:ml-6',
          '[&_.ProseMirror_li]:leading-relaxed [&_.ProseMirror_li]:mb-1',
          '[&_.ProseMirror_li_p]:mb-0 [&_.ProseMirror_li_p]:leading-relaxed',
          '[&_.ProseMirror]:empty:before:content-[attr(data-placeholder)]',
          '[&_.ProseMirror]:empty:before:text-muted-foreground',
          '[&_.ProseMirror]:empty:before:pointer-events-none',
          '[&_.ProseMirror]:empty:before:float-left',
          '[&_.ProseMirror]:empty:before:h-0'
        )}
      />
    </div>
  )
}

export default RichMinimalEditor
