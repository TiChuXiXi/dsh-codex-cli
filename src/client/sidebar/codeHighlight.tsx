import * as React from 'react'
import hljs from 'highlight.js/lib/common'

const languages: Record<string, string> = {
  c:'c', h:'cpp', cc:'cpp', cpp:'cpp', cxx:'cpp', hpp:'cpp',
  js:'javascript', jsx:'javascript', mjs:'javascript', cjs:'javascript',
  ts:'typescript', tsx:'typescript', json:'json', py:'python', sh:'bash',
  bash:'bash', zsh:'bash', html:'xml', htm:'xml', xml:'xml', svg:'xml',
  css:'css', scss:'scss', yml:'yaml', yaml:'yaml', md:'markdown',
  markdown:'markdown', java:'java', go:'go', rs:'rust', sql:'sql',
  rb:'ruby', php:'php', cs:'csharp', swift:'swift', kt:'kotlin',
}
export function highlightCodeLines(text: string, extension: string): React.ReactNode[][] {
  const language = languages[extension]
  if (!language || !hljs.getLanguage(language)) return text.split('\n').map(line => [line || ' '])
  let html: string
  try { html = hljs.highlight(text, {language, ignoreIllegals:true}).value }
  catch { return text.split('\n').map(line => [line || ' ']) }
  const doc = new DOMParser().parseFromString('<body>' + html + '</body>', 'text/html')
  const lines: React.ReactNode[][] = [[]]
  let key = 0
  const visit = (node: Node, classes: string[]) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const parts = (node.textContent || '').split('\n')
      parts.forEach((part, index) => {
        if (index) lines.push([])
        if (part) lines[lines.length - 1].push(classes.length ? <span key={key++} className={classes.join(' ')}>{part}</span> : part)
      })
    } else if (node instanceof Element) {
      const next = [...classes, ...Array.from(node.classList)]
      node.childNodes.forEach(child => visit(child, next))
    }
  }
  doc.body.childNodes.forEach(node => visit(node, []))
  return lines.map(line => line.length ? line : [' '])
}
