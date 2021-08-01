import React from "react";
import { useEffect } from "react";
import { Editor } from "skyline-editor"
import WebFont from 'webfontloader';

const CodeEditor: React.FC<{ initialValue: string }> = ({ initialValue }) => {
  const [editor, setEditor] = React.useState<Editor>(null);
  const canvas = React.useRef(null);

  useEffect(() => {
    WebFont.load({
      custom: {
        families: ['consolas'],
        urls: ['/src/consolas.woff']
      }
    });

    const editor = new Editor(initialValue);
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
        width: "100%",
        height: "100%",
        background: "#1c1e26",

        cursor: 'text'
      }}
      ref={canvas}
    />
  );
};

export default CodeEditor;
