import type { Editor } from '..'
import type { Shortcut } from '../types'

function paste(editor: Editor) {
  const handlePaste = (text: string) => {
    editor.write(text)
    editor.position.column += text.length
  }
  if (!('navigator' in window) || !('clipboard' in navigator)) {
    throw Error('Clipboard API is not supported')
  }
  navigator.clipboard.readText().then((text) => {
    handlePaste(text)
    window.requestAnimationFrame(() => editor.draw())
  })
  return false
}

export function pasteShortcut(): Shortcut {
  return {
    name: 'Paste',
    description: 'Copies a cursor down',
    key: 'v',
    ctrl: true,
    alt: false,
    shift: false,
    impl: paste,
  }
}
