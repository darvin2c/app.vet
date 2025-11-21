import { describe, it, expect } from 'vitest'
import {
  toWhatsAppText,
  toHtmlEmail,
} from '../../ui/rich-minimal-editor.parsers'

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
    expect(text).toContain('- Item A')
    expect(text).toContain('- Item B')
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
    expect(email).toMatch(
      /style="margin:0 0 8px;line-height:1.6;font-size:14px"/
    )
    expect(email).toMatch(/style="margin:0 0 8px;padding-left:20px"/)
    expect(email).toMatch(/style="color:#2563eb;text-decoration:underline"/)
  })

  it('toWhatsAppText maps strong/em/strike/code to WhatsApp formatting', () => {
    const html = `
      <p><strong>N</strong> <em>I</em> <s>T</s> <code>C</code></p>
    `
    const text = toWhatsAppText(html)
    expect(text).toContain('*N*')
    expect(text).toContain('_I_')
    expect(text).toContain('~T~')
    expect(text).toContain('`C`')
  })

  it('toWhatsAppText renders pre as fenced code block', () => {
    const html = `
      <pre>line 1\nline 2</pre>
    `
    const text = toWhatsAppText(html)
    expect(text).toMatch(/```\nline 1\nline 2\n```/)
  })

  it('toWhatsAppText renders blockquote with > prefix', () => {
    const html = `
      <blockquote><p>Quote line</p></blockquote>
    `
    const text = toWhatsAppText(html)
    expect(text).toContain('> Quote line')
  })

  it('toWhatsAppText renders ordered list with numbering', () => {
    const html = `
      <ol>
        <li>Primero</li>
        <li>Segundo</li>
      </ol>
    `
    const text = toWhatsAppText(html)
    expect(text).toContain('1. Primero')
    expect(text).toContain('2. Segundo')
  })
})
