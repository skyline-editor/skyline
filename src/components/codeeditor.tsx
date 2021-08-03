/*
    Copyright 2021 Tejas Ravishankar, Eliyah Sundström, Pranav Doshi
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
        http://www.apache.org/licenses/LICENSE-2.0
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

import React from 'react';
import { useEffect } from 'react';
import { Editor } from '../../editor/';
import WebFont from 'webfontloader';
import typescript from '@skyline-editor/language-typescript';
import FileSystem from '../model/FileSystem';

const CodeEditor: React.FC<{ initialValue: string }> = ({ initialValue }) => {
  const [editor, setEditor] = React.useState<Editor>(null);
  const canvas = React.useRef(null);

  useEffect(() => {
    WebFont.load({
      custom: {
        families: ['consolas'],
        urls: ['/src/consolas.woff'],
      },
    });

    const fileSystem = new FileSystem();

    const editor = new Editor(initialValue);
    editor.language = typescript;

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
