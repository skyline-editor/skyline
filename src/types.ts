export interface RectInit {
  width: number
  height: number
  x: number
  y: number
  fill?: string
  ctx?: CanvasRenderingContext2D
}

export interface EditorConfig {
  fontSize: number
  fontFamily: string
  lineHeight: number
  cursorType: 'slim'
  /** The number of spaces within a "tab". This **must** not be < 2. */
  tabSize: number
  softWrap: boolean
}
