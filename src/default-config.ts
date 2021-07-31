import type { EditorConfig } from './types'
import { copyCursorUpShortcut } from './shortcuts/copy-cursor-up'
import { copyCursorDownShortcut } from './shortcuts/copy-cursor-down'
import { controlBackspaceShortcut } from './shortcuts/control-backspace'
import { pasteShortcut } from './shortcuts/paste'

export const getDefaultConfig = (): EditorConfig => ({
  fontFamily: 'consolas',
  fontSize: 22,
  lineHeight: 1.3,
  cursorType: 'slim',
  tabSize: 2,
  softWrap: false,
  includeDefaultShortcuts: true,
  shortcuts: [
    copyCursorUpShortcut(),
    copyCursorDownShortcut(),
    controlBackspaceShortcut(),
    pasteShortcut(),
  ],
  showLineNumbers: true,
})
