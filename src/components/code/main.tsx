import React, { useEffect } from "react";
import { CodeEditor } from "./codeEditor";

export default function Main() {
  const [defaultCode, setDefaultCode] = React.useState("");
  const [loaded, setLoaded] = React.useState(false);

  useEffect(() => {
    fetch("/test.txt")
      .then((r) => r.text())
      .then((v) => {
        setDefaultCode(v.split("\r").join(""));
        setLoaded(true);
      });
  }, []);

  if (!loaded) return <div>Loading...</div>;

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <header>
        <title>Skyline Editor</title>
      </header>

      <CodeEditor initialValue={defaultCode} />
    </div>
  );
}
