import type { Editor } from '..'
import type { Shortcut } from '../types'

function copyCursorDown(editor: Editor) {
  const { lines, currentLine, position } = editor
  lines.splice(position.line + 1, 0, currentLine)
  position.line++
  return true
}

export function copyCursorDownShortcut(): Shortcut {
  return {
    name: 'CopyCursorDown',
    description: 'Copies a cursor down',
    key: 'ArrowDown',
    ctrl: false,
    alt: true,
    shift: true,
    impl: copyCursorDown,
  }
}
