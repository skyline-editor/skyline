import type { Editor } from '..'
import type { Shortcut } from '../types'

function copyCursorUp(editor: Editor) {
  const { lines, currentLine, position } = editor
  lines.splice(position.line, 0, currentLine)
  return true
}

export function copyCursorUpShortcut(): Shortcut {
  return {
    name: 'CopyCursorUp',
    description: 'Copies a cursor up',
    key: 'ArrowUp',
    ctrl: false,
    alt: true,
    shift: true,
    impl: copyCursorUp,
  }
}
