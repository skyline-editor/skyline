import type { EditorConfig } from './types'

export const getDefaultConfig = (): EditorConfig => ({
  fontFamily: 'consolas',
  fontSize: 22,
  lineHeight: 1.3,
  cursorType: 'slim',
  tabSize: 2,
  softWrap: false,
})
