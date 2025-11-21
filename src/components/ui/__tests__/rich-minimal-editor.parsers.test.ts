import { describe, it, expect } from 'vitest'
import { toWhatsAppText, toHtmlEmail } from '../../ui/rich-minimal-editor.parsers'

describe('rich-minimal-editor parsers', () => {
  it('toWhatsAppText converts paragraphs, breaks, lists and links', () => {
    const html = `
      <p>Hola <a href="https://example.com">Sitio</a><br/>Linea 2</p>
      <ul>
        <li>Item A</li>
        <li>Item B</li>
      </ul>
      <p>URL directa: <a href="https://example.com">https://example.com</a></p>
    `
    const text = toWhatsAppText(html)
    expect(text).toContain('Hola Sitio (https://example.com)')
    expect(text).toContain('Linea 2')
    expect(text).toContain('• Item A')
    expect(text).toContain('• Item B')
    expect(text).toContain('URL directa: https://example.com')
    expect(text).not.toMatch(/<[^>]+>/)
  })

  it('toHtmlEmail strips classes/unsafe attrs and applies minimal inline styles', () => {
    const html = `
      <p class="ProseMirror_p some-class" onclick="alert('x')">Texto <a href="https://example.com" class="link">link</a></p>
      <ul class="ProseMirror_ul"><li data-test="x">Item</li></ul>
      <script>console.log('bad')</script>
    `
    const email = toHtmlEmail(html)
    expect(email).not.toMatch(/class=/)
    expect(email).not.toMatch(/ProseMirror/)
    expect(email).not.toMatch(/onclick=/)
    expect(email).not.toMatch(/<script>/)
    expect(email).toMatch(/style="margin:0 0 8px;line-height:1.6;font-size:14px"/)
    expect(email).toMatch(/style="margin:0 0 8px;padding-left:20px"/)
    expect(email).toMatch(/style="color:#2563eb;text-decoration:underline"/)
  })
})