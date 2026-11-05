/**
 * 轻量 markdown 渲染：只产出 React 节点，不拼 HTML、不注入 innerHTML。
 *
 * 覆盖 Codex 输出里最常见的语法：标题、段落、列表、引用、代码块、行内代码、
 * 粗体/斜体、链接、分隔线、简单表格。嵌套列表与复杂表格不追求完整支持。
 */

import * as React from 'react'

type Block =
  | { kind: 'code', lang: string, text: string }
  | { kind: 'heading', level: number, text: string }
  | { kind: 'paragraph', lines: string[] }
  | { kind: 'list', ordered: boolean, items: string[] }
  | { kind: 'quote', lines: string[] }
  | { kind: 'table', header: string[], rows: string[][] }
  | { kind: 'hr' }

export function Markdown({ text }: { text: string }) {
  const blocks = React.useMemo(() => parseBlocks(text), [text])
  return (
    <div className="dsh-codex-markdown">
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  )
}

function renderBlock(block: Block, key: number): React.ReactNode {
  switch (block.kind) {
    case 'code':
      return (
        <pre key={key} className="dsh-codex-pre">
          <code>{block.text}</code>
        </pre>
      )
    case 'heading': {
      const Tag = `h${Math.min(block.level, 4)}` as any
      return React.createElement(Tag, { key }, renderInline(block.text, `h${key}`))
    }
    case 'paragraph':
      return <p key={key}>{renderLines(block.lines, `p${key}`)}</p>
    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul'
      return React.createElement(
        Tag,
        { key },
        block.items.map((item, index) => <li key={`${key}-${index}`}>{renderInline(item, `li${key}-${index}`)}</li>),
      )
    }
    case 'quote':
      return <blockquote key={key}>{renderLines(block.lines, `q${key}`)}</blockquote>
    case 'table':
      return (
        <table key={key}>
          <thead>
            <tr>
              {block.header.map((cell, index) => (
                <th key={`${key}-h-${index}`}>{renderInline(cell, `th${key}-${index}`)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={`${key}-r-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <td key={`${key}-c-${rowIndex}-${cellIndex}`}>{renderInline(cell, `td${key}-${rowIndex}-${cellIndex}`)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )
    case 'hr':
      return <hr key={key} />
    default:
      return null
  }
}

/** 段落内保留单个换行（Codex 的输出习惯），行内语法照常解析。 */
function renderLines(lines: string[], keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  lines.forEach((line, index) => {
    if (index > 0) nodes.push(<br key={`${keyPrefix}-br-${index}`} />)
    nodes.push(...renderInline(line, `${keyPrefix}-${index}`))
  })
  return nodes
}

const INLINE = /(`[^`\n]+`)|(\*\*[^*\n]+\*\*)|(\*[^*\n]+\*)|(\[[^\]\n]+\]\([^)\s]+\))/gu

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  let last = 0
  let match: RegExpExecArray | null
  INLINE.lastIndex = 0
  let index = 0
  while ((match = INLINE.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index))
    const token = match[0]
    const key = `${keyPrefix}-${index}`
    if (token.startsWith('`')) {
      nodes.push(<code key={key}>{token.slice(1, -1)}</code>)
    } else if (token.startsWith('**')) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>)
    } else if (token.startsWith('*')) {
      nodes.push(<em key={key}>{token.slice(1, -1)}</em>)
    } else {
      const linkMatch = /^\[([^\]]+)\]\(([^)\s]+)\)$/u.exec(token)
      if (linkMatch === null) {
        nodes.push(token)
      } else {
        const [, label, href] = linkMatch
        if (/^https?:\/\//iu.test(href) || href.startsWith('/')) {
          nodes.push(
            <a key={key} href={href} target="_blank" rel="noreferrer noopener">
              {label}
            </a>,
          )
        } else {
          nodes.push(label)
        }
      }
    }
    last = match.index + token.length
    index += 1
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

function parseBlocks(text: string): Block[] {
  const lines = text.replace(/\r\n/gu, '\n').split('\n')
  const blocks: Block[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]

    if (line.trim() === '') {
      index += 1
      continue
    }

    // 围栏代码块
    const fence = /^\s*```([\w+-]*)\s*$/u.exec(line)
    if (fence !== null) {
      const lang = fence[1] ?? ''
      const body: string[] = []
      index += 1
      while (index < lines.length && !/^\s*```\s*$/u.test(lines[index])) {
        body.push(lines[index])
        index += 1
      }
      index += 1
      blocks.push({ kind: 'code', lang, text: body.join('\n') })
      continue
    }

    // 分隔线
    if (/^\s*([-*_])\s*\1\s*\1[\s\S]*$/u.test(line) && line.trim().length >= 3) {
      blocks.push({ kind: 'hr' })
      index += 1
      continue
    }

    // 标题
    const heading = /^(#{1,6})\s+(.*)$/u.exec(line)
    if (heading !== null) {
      blocks.push({ kind: 'heading', level: heading[1].length, text: heading[2].trim() })
      index += 1
      continue
    }

    // 表格：当前行含 | 且下一行是分隔行
    if (line.includes('|') && index + 1 < lines.length && /^\s*\|?[\s:|-]+\|?\s*$/u.test(lines[index + 1]) && lines[index + 1].includes('-')) {
      const header = splitRow(line)
      index += 2
      const rows: string[][] = []
      while (index < lines.length && lines[index].includes('|') && lines[index].trim() !== '') {
        rows.push(splitRow(lines[index]))
        index += 1
      }
      blocks.push({ kind: 'table', header, rows })
      continue
    }

    // 引用
    if (/^\s*>\s?/u.test(line)) {
      const quote: string[] = []
      while (index < lines.length && /^\s*>\s?/u.test(lines[index])) {
        quote.push(lines[index].replace(/^\s*>\s?/u, ''))
        index += 1
      }
      blocks.push({ kind: 'quote', lines: quote })
      continue
    }

    // 列表
    const listItem = /^\s*([-*+]|\d+\.)\s+(.*)$/u.exec(line)
    if (listItem !== null) {
      const ordered = /\d+\./u.test(listItem[1])
      const items: string[] = []
      while (index < lines.length) {
        const item = /^\s*([-*+]|\d+\.)\s+(.*)$/u.exec(lines[index])
        if (item === null) break
        if (/\d+\./u.test(item[1]) !== ordered) break
        items.push(item[2])
        index += 1
      }
      blocks.push({ kind: 'list', ordered, items })
      continue
    }

    // 段落：连续非空行
    const paragraph: string[] = []
    while (index < lines.length && lines[index].trim() !== '') {
      const next = lines[index]
      if (
        /^\s*```/u.test(next) ||
        /^(#{1,6})\s+/u.test(next) ||
        /^\s*>\s?/u.test(next) ||
        /^\s*([-*+]|\d+\.)\s+/u.test(next)
      ) {
        break
      }
      paragraph.push(next)
      index += 1
    }
    if (paragraph.length > 0) blocks.push({ kind: 'paragraph', lines: paragraph })
    else index += 1
  }

  return blocks
}

function splitRow(line: string): string[] {
  let text = line.trim()
  if (text.startsWith('|')) text = text.slice(1)
  if (text.endsWith('|')) text = text.slice(0, -1)
  return text.split('|').map((cell) => cell.trim())
}
