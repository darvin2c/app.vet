import React from 'react'
// @vitest-environment happy-dom
import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
vi.mock('../../ui/skeleton', () => ({
  Skeleton: (props: React.ComponentProps<'div'>) => <div {...props} />,
}))
import { render, screen } from '@testing-library/react'
import { RichMinimalEditor } from '../../ui/rich-minimal-editor/index'

describe('RichMinimalEditor component', () => {
  it('mount: emite onParsedChange con todos los formatos y no llama onChange', () => {
    const html = `
      <p><strong>Hola</strong> mundo</p>
      <ul><li>Item</li></ul>
      <a href="https://example.com">Link</a>
    `
    const onChange = vi.fn()
    const onParsedChange = vi.fn()
    render(
      <RichMinimalEditor
        value={html}
        onChange={onChange}
        onParsedChange={onParsedChange}
      />
    )
    const calls = onParsedChange.mock.calls
    expect(calls.length).toBeGreaterThan(0)
    const last = calls.at(-1)![0]
    expect(last.html).toContain('<strong>Hola</strong>')
    expect(last.whatsappText).toContain('*Hola* mundo')
    expect(last.htmlEmail).not.toMatch(/class=/)
    expect(last.raw).toBeTruthy()
    expect(onChange).not.toHaveBeenCalled()
    // asegura que el componente se renderiza
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('rerender: al cambiar value se vuelve a emitir onParsedChange', () => {
    const onParsedChange = vi.fn()
    const { rerender } = render(
      <RichMinimalEditor value="<p>Uno</p>" onParsedChange={onParsedChange} />
    )
    rerender(
      <RichMinimalEditor value="<p>Dos</p>" onParsedChange={onParsedChange} />
    )
    expect(onParsedChange).toHaveBeenCalled()
    const last = onParsedChange.mock.calls.at(-1)![0]
    expect(last.html).toContain('Dos')
  })
})
