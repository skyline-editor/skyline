import type { Editor } from '.'

export interface RectInit {
  width: number
  height: number
  x: number
  y: number
  fill?: string
  ctx?: CanvasRenderingContext2D
}

export interface Shortcut {
  name: string
  description: string
  key: string
  ctrl?: boolean
  alt?: boolean
  shift?: boolean
  /** @returns a boolean indicating whether a redraw is required */
  impl: (editor: Editor) => boolean
}

export interface EditorConfig {
  fontSize: number
  fontFamily: string
  lineHeight: number
  cursorType: 'slim'
  /** The number of spaces within a "tab". This **must** not be < 2. */
  tabSize: number
  softWrap: boolean
  includeDefaultShortcuts: boolean
  shortcuts: Shortcut[]
}
