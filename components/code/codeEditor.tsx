import { useState } from "react";
import styles from '../../styles/CodeEditor.module.css'
import { codeFromTokens, tokenize } from "./tokenizer";

export interface CodeEditorProps {
  initialValue: string;
  onChange?: (code: string) => void;
}

export const CodeEditor = ({
  initialValue,
}) => {
  const [code, setCode] = useState(initialValue);
  
  return (
    <div className={styles.codeEditor}>
      <div className={styles.line}>{codeFromTokens(tokenize(code))}</div>
    </div>
  );
}