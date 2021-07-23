// SOURCE: https://gist.github.com/cenguidanos/58efcf54c5539101d9a47345d6cea35d

import React, { useRef, useEffect, useState } from 'react'

import { EditorView, ViewUpdate } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { basicSetup } from '@codemirror/basic-setup'
import { markdown } from '@codemirror/lang-markdown'
import { oneDark } from '@codemirror/theme-one-dark'

const CodeEditor: React.FC<{ initialValue: string }> = ({ initialValue }) => {
  // Local state
  const [editorValue, setEditorValue] = useState('')
  const [editorTreeValue, setEditorTreeValue] = useState([])

  // Ref of the editor
  const editor = useRef<EditorView>()

  // Event listener on editor updates
  const onUpdate = () =>
    EditorView.updateListener.of((v: ViewUpdate) => {
      const doc = v.state.doc

      /**
       * # Contenido
       *
       * ```js
       * const x () => {
       *   console.log(45);
       * }
       * ```
       */
      const value = doc.toString()
      if (value !== editorValue) setEditorValue(value)

      /**
       * [
       *   "# Contenido",
       *   "",
       *   "```js",
       *   "const x () => {",
       *   "  console.log(45);",
       *   "}",
       *   "```"
       * ]
       */
      let treeArray = new Array()
      treeArray = [...doc.toJSON()]

      if (treeArray !== editorTreeValue) setEditorTreeValue(treeArray)
    })

  // Initilize view
  useEffect(function initEditorView() {
    const el = document.getElementById('codemirror-editor-wrapper')

    editor.current = new EditorView({
      state: EditorState.create({
        doc: initialValue,
        extensions: [basicSetup, markdown(), oneDark, onUpdate()],
      }),
      parent: el as Element,
    })
  }, [])

  // Component for display text
  const OutputText = () => (
    <div className="border rounded p-5">
      <pre>
        <code>{editorValue}</code>
      </pre>
    </div>
  )

  // Component for display array from editor
  const OutputArray = () => (
    <div className="border rounded p-5">
      <pre>
        <code>{JSON.stringify(editorTreeValue, null, 2)}</code>
      </pre>
    </div>
  )

  return (
    <div className="grid gap-8">
      <div className="grid grid-cols-2 gap-5">
        <div id="codemirror-editor-wrapper" />
        <OutputText />
      </div>
      <OutputArray />
    </div>
  )
}

export default CodeEditor
