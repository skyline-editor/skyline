import React from 'react';
import { useEffect } from 'react';
import { Editor } from '../../editor/';
import WebFont from 'webfontloader';
import FileSystem from '../model/FileSystem';

import typescript from '@skyline-editor/language-typescript';
import skyline_night from '@skyline-editor/theme-skyline-night';

const CodeEditor: React.FC<{ initialValue: string }> = ({ initialValue }) => {
  const [editor, setEditor] = React.useState<Editor>(null);
  const canvas = React.useRef(null);

  useEffect(() => {
    // WebFont.load({
    //   custom: {
    //     families: ['consolas'],
    //     urls: ['/src/consolas.tff'],
    //   },
    // });

    const fileSystem = new FileSystem();

    const editor = new Editor(initialValue);
    editor.language = typescript;
    editor.theme = skyline_night;

    editor.on('save', (editor) => {
      fileSystem.writeFile('greet.ts', editor.code);
    });

    setEditor(editor);
  }, []);

  useEffect(() => {
    if (!editor) return;
    if (!canvas) return;

    editor.mount(canvas.current);
  }, [editor, canvas]);

  console.log(editor);

  return (
    <canvas
      id="skyline-editor-wrapper"
      style={{
        width: '100%',
        height: '100%',
        background: '#1c1e26',
        cursor: 'text',
      }}
      ref={canvas}
    />
  );
};

export default CodeEditor;
