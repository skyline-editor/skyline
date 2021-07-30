import { Editor } from './src/index'

// all of these options and the object are optional - sane defaults are used
const editor = new Editor({
  fontSize: 22,
  fontFamily: 'consolas',
  cursorType: 'slim',
  tabSize: 2,
  lineHeight: 1.3,
})

// this makes it show up in dev tools for customizing on the fly
;(globalThis as any).editor = editor

editor.mount(document.querySelector('#editor-cv')!)

editor.setup()
editor.canvas.focus()

// A draw (via `editor.draw`) is not required because nothing needs to be drawn
// until an event is called from setup's event listeners (i.e. keypress).
