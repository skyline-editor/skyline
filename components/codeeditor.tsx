// SOURCE: https://gist.github.com/cenguidanos/58efcf54c5539101d9a47345d6cea35d

import React, { useRef, useEffect, useState } from 'react'

import { EditorView, keymap, ViewUpdate } from '@codemirror/view'
import { autocompletion } from '@codemirror/autocomplete'
import { lineNumbers } from '@codemirror/gutter'
import { EditorState, Compartment } from '@codemirror/state'
import { basicSetup } from '@codemirror/basic-setup'
import { defaultTabBinding } from '@codemirror/commands'

// Themes
import { oneDark } from '@codemirror/theme-one-dark'

// Languages
import { htmlLanguage, html } from '@codemirror/lang-html'
import { language } from '@codemirror/language'
import { javascript } from '@codemirror/lang-javascript'

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

      const value = doc.toString()

      if (value !== editorValue) setEditorValue(value)
      let treeArray = new Array()
      treeArray = [...doc.toJSON()]

      if (treeArray !== editorTreeValue) setEditorTreeValue(treeArray)
    })

  // Initilize view
  useEffect(function initEditorView() {
    const el = document.getElementById('codemirror-editor-wrapper')

    const tabSize = new Compartment(),
      languageConf = new Compartment()

    const autoLanguage = EditorState.transactionExtender.of((tr) => {
      if (!tr.docChanged) return null
      let docIsHTML = /^\s*</.test(tr.newDoc.sliceString(0, 100))
      let stateIsHTML = tr.startState.facet(language) == htmlLanguage
      if (docIsHTML == stateIsHTML) return null
      return {
        effects: languageConf.reconfigure(docIsHTML ? html() : javascript()),
      }
    })

    editor.current = new EditorView({
      state: EditorState.create({
        doc: initialValue,
        extensions: [
          basicSetup,
          autocompletion(),
          lineNumbers(),
          keymap.of([defaultTabBinding]),
          tabSize.of(EditorState.tabSize.of(4)),
          languageConf.of(javascript()),
          autoLanguage,
          oneDark,
          onUpdate(),
        ],
      }),
      parent: el as Element,
    })
  }, [])

  return (
    <div
      id="codemirror-editor-wrapper"
      style={{
        position: 'absolute',
        left: '0',
        width: '100vw',
        height: '300px',
      }}
    />
  )
}

export default CodeEditor
