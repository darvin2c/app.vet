export function toWhatsAppText(html: string): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html || '', 'text/html')
  const sanitizeText = (s: string) => s.replace(/\s+/g, ' ').trim()
  const renderNode = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) return (node as Text).data
    if (node.nodeType !== Node.ELEMENT_NODE) return ''
    const el = node as HTMLElement
    const tag = el.tagName
    if (tag === 'BR') return '\n'
    if (tag === 'STRONG' || tag === 'B') {
      const inner = sanitizeText(
        Array.from(el.childNodes).map(renderNode).join('')
      )
      return `*${inner}*`
    }
    if (tag === 'EM' || tag === 'I') {
      const inner = sanitizeText(
        Array.from(el.childNodes).map(renderNode).join('')
      )
      return `_${inner}_`
    }
    if (tag === 'S' || tag === 'DEL' || tag === 'STRIKE') {
      const inner = sanitizeText(
        Array.from(el.childNodes).map(renderNode).join('')
      )
      return `~${inner}~`
    }
    if (tag === 'CODE') {
      const inner = sanitizeText(
        Array.from(el.childNodes).map(renderNode).join('')
      )
      return `\`${inner}\``
    }
    if (tag === 'A') {
      const href = el.getAttribute('href') || ''
      const inner = sanitizeText(
        Array.from(el.childNodes).map(renderNode).join('')
      )
      if (!href) return inner
      if (!inner) return href
      if (inner === href) return href
      return `${inner} (${href})`
    }
    if (tag === 'LI') {
      const parent = el.parentElement?.tagName
      const bullet = parent === 'OL' ? '' : '- '
      const inner = sanitizeText(
        Array.from(el.childNodes).map(renderNode).join('')
      )
      return `${bullet}${inner}\n`
    }
    if (tag === 'P' || tag === 'DIV' || tag === 'PRE') {
      if (tag === 'PRE') {
        const innerCode = Array.from(el.childNodes).map(renderNode).join('')
        return `\n\n` + '```' + `\n${innerCode}\n` + '```' + `\n\n`
      }
      const inner = Array.from(el.childNodes).map(renderNode).join('')
      return `${sanitizeText(inner)}\n`
    }
    if (tag === 'UL') {
      const items = Array.from(el.children).filter(
        (c) => c.tagName === 'LI'
      ) as HTMLElement[]
      return (
        items
          .map(
            (li) =>
              `- ${sanitizeText(Array.from(li.childNodes).map(renderNode).join(''))}`
          )
          .join('\n') + '\n\n'
      )
    }
    if (tag === 'OL') {
      const items = Array.from(el.children).filter(
        (c) => c.tagName === 'LI'
      ) as HTMLElement[]
      return (
        items
          .map(
            (li, i) =>
              `${i + 1}. ${sanitizeText(Array.from(li.childNodes).map(renderNode).join(''))}`
          )
          .join('\n') + '\n\n'
      )
    }
    if (tag === 'BLOCKQUOTE') {
      const inner = Array.from(el.childNodes).map(renderNode).join('')
      return (
        inner
          .split(/\n+/)
          .map((line) => (line.trim() ? `> ${line.trim()}` : ''))
          .filter(Boolean)
          .join('\n') + '\n'
      )
    }
    return Array.from(el.childNodes).map(renderNode).join('')
  }
  const text = Array.from(doc.body.childNodes).map(renderNode).join('')
  return text
    .replace(/\n{3,}/g, '\n\n')
    .split('\n')
    .map((l) => l.trimEnd())
    .join('\n')
    .trim()
}

export function toHtmlEmail(html: string): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html || '', 'text/html')
  const removeUnsafeAttrs = (el: Element) => {
    const attrs = Array.from(el.attributes)
    for (const a of attrs) {
      const name = a.name.toLowerCase()
      if (name === 'class' || name.startsWith('on') || name.startsWith('data-'))
        el.removeAttribute(a.name)
    }
  }
  const elements = Array.from(doc.body.querySelectorAll('*'))
  for (const el of elements) {
    removeUnsafeAttrs(el)
    const tag = el.tagName
    if (tag === 'SCRIPT' || tag === 'STYLE') {
      el.remove()
      continue
    }
    if (tag === 'P')
      el.setAttribute('style', 'margin:0 0 8px;line-height:1.6;font-size:14px')
    else if (tag === 'UL' || tag === 'OL')
      el.setAttribute('style', 'margin:0 0 8px;padding-left:20px')
    else if (tag === 'LI')
      el.setAttribute('style', 'margin:0 0 4px;line-height:1.6')
    else if (tag === 'A') {
      el.setAttribute('style', 'color:#2563eb;text-decoration:underline')
      el.setAttribute('target', '_blank')
      el.setAttribute('rel', 'noopener')
    }
  }
  return doc.body.innerHTML
}
