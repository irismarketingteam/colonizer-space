import { useRef, useCallback } from 'react'

const TOOLS = [
  { label: 'H1', prefix: '# ', block: true },
  { label: 'H2', prefix: '## ', block: true },
  { label: 'H3', prefix: '### ', block: true },
  { label: 'H4', prefix: '#### ', block: true },
  { type: 'sep' },
  { label: 'B', prefix: '**', suffix: '**', style: 'font-bold' },
  { label: 'I', prefix: '*', suffix: '*', style: 'italic' },
  { type: 'sep' },
  { label: 'Link', action: 'link' },
  { label: 'Quote', action: 'pullquote' },
]

export default function MarkdownToolbar({ textareaRef, value, onChange }) {
  const apply = useCallback((tool) => {
    const el = textareaRef.current
    if (!el) return

    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = value.substring(start, end)

    let replacement
    let cursorOffset

    if (tool.action === 'link') {
      const url = selected.startsWith('http') ? selected : 'https://'
      const text = selected.startsWith('http') ? 'link text' : (selected || 'link text')
      replacement = `[${text}](${url})`
      cursorOffset = selected.startsWith('http') ? 1 : start + 1
    } else if (tool.action === 'pullquote') {
      const text = selected || 'Pull quote text here'
      replacement = `\n> ${text}\n`
      cursorOffset = start + 3
    } else if (tool.block) {
      const lineStart = value.lastIndexOf('\n', start - 1) + 1
      const currentLine = value.substring(lineStart, end)
      const stripped = currentLine.replace(/^#{1,4}\s*/, '')
      replacement = `${tool.prefix}${stripped}`
      const newValue = value.substring(0, lineStart) + replacement + value.substring(end)
      onChange(newValue)
      requestAnimationFrame(() => {
        el.focus()
        const pos = lineStart + replacement.length
        el.setSelectionRange(pos, pos)
      })
      return
    } else {
      const text = selected || 'text'
      replacement = `${tool.prefix}${text}${tool.suffix}`
      cursorOffset = start + tool.prefix.length
    }

    const newValue = value.substring(0, start) + replacement + value.substring(end)
    onChange(newValue)

    requestAnimationFrame(() => {
      el.focus()
      if (selected) {
        el.setSelectionRange(start, start + replacement.length)
      } else {
        const pos = cursorOffset !== undefined ? cursorOffset : start + replacement.length
        el.setSelectionRange(pos, pos + (tool.action ? 0 : (selected || 'text').length))
      }
    })
  }, [textareaRef, value, onChange])

  return (
    <div className="flex items-center gap-1 px-2 py-1.5 bg-elevated border border-subtle border-b-0">
      {TOOLS.map((tool, i) =>
        tool.type === 'sep' ? (
          <div key={i} className="w-px h-5 bg-text-tertiary/20 mx-1" />
        ) : (
          <button
            key={tool.label}
            type="button"
            onClick={() => apply(tool)}
            className={`px-2 py-0.5 font-mono text-micro text-text-secondary hover:text-text-primary hover:bg-surface transition-colors ${tool.style || ''}`}
            title={tool.label === 'B' ? 'Bold' : tool.label === 'I' ? 'Italic' : tool.label}
          >
            {tool.label}
          </button>
        )
      )}
    </div>
  )
}
