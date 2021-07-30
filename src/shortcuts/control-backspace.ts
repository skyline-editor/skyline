import type { Editor } from '..'
import type { Shortcut } from '../types'

function controlBackspace(editor: Editor) {
  const { currentLine, position } = editor
  const { column } = position
  if (column === 0) {
    return editor.emulateBuiltinKey('Backspace')
  }
  const alpha = 'abcdefghijklmnopqrstuvwxyz'
  const alikeChars = [
    ' ',
    ')(*&^%$#@!~`{}|:"<>?[]\\;\',./_-+=',
    `${alpha}${alpha.toUpperCase()}0123456789`,
  ]
  let i = column - 1
  let group!: string
  while (i > 0) {
    const ch = currentLine[i]
    if (group === undefined) {
      group = alikeChars.find((val) => val.includes(ch))
    } else {
      if (!group.includes(ch)) {
        i++
        break
      }
    }

    i--
  }

  editor.currentLine = currentLine.slice(0, i) + currentLine.slice(column)
  position.column = i

  return true
}

export function controlBackspaceShortcut(): Shortcut {
  return {
    name: 'ControlBackspace',
    description:
      'Removes similar characters instead of one when doing backspace.',
    key: 'Backspace',
    ctrl: true,
    alt: false,
    shift: false,
    impl: controlBackspace,
  }
}
